<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Http\Resources\LeaderboardRowResource;


class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'season' => ['nullable', 'integer', 'min:1990', 'max:' . (int) now()->format('Y')],
            'search' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', 'in:active,inactive'],
            'sort' => ['nullable', 'string', 'max:30'],
            'order' => ['nullable', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $season = (int) ($data['season'] ?? now()->format('Y'));
        $limit  = (int) ($data['limit'] ?? 25);
        $order  = $data['order'] ?? 'desc';

        [$q] = $this->buildLeaderboardQuery($data, $season, $order);

        return LeaderboardRowResource::collection($q->paginate($limit));
    }

    public function export(Request $request): StreamedResponse
    {
        $data = $request->validate([
            'season' => ['nullable', 'integer', 'min:1990', 'max:' . (int) now()->format('Y')],
            'search' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', 'in:active,inactive'],
            'sort' => ['nullable', 'string', 'max:30'],
            'order' => ['nullable', 'in:asc,desc'],
        ]);

        $season = (int) ($data['season'] ?? now()->format('Y'));
        $order  = $data['order'] ?? 'desc';

        [$q, $sortKey] = $this->buildLeaderboardQuery($data, $season, $order);

        // Safety cap (assignment says a few thousand records; this prevents memory/abuse)
        $max = 5000;

        $filename = "49ers_leaderboard_{$season}_" . now()->format('Ymd_His') . ".csv";

        return response()->streamDownload(function () use ($q, $max) {
            $out = fopen('php://output', 'w');

            // header row
            fputcsv($out, [
                'player_id',
                'first_name',
                'last_name',
                'position',
                'jersey_number',
                'status',
                'age',
                'height_in',
                'weight_lb',
                'experience_years',
                'college',
                'season',
                'games_played',
                'touchdowns',
                'yards',
                'tackles',
            ]);

            $rows = $q->limit($max)->get();
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r->player_id,
                    $r->first_name,
                    $r->last_name,
                    $r->position,
                    $r->jersey_number,
                    $r->status,
                    $r->age,
                    $r->height_in,
                    $r->weight_lb,
                    $r->experience_years,
                    $r->college,
                    $r->season,
                    $r->games_played,
                    $r->touchdowns,
                    $r->yards,
                    $r->tackles,
                ]);
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function buildLeaderboardQuery(array $data, int $season, string $order): array
    {
        $statsSub = DB::table('player_stats')
            ->select([
                'player_id',
                'season',
                'games_played',
                'touchdowns',
                'yards',
                'tackles',
            ])
            ->where('season', $season);

        $sortMap = [
            'touchdowns'   => 'touchdowns',
            'yards'        => 'yards',
            'tackles'      => 'tackles',
            'games_played' => 'games_played',
            'last_name'    => 'players.last_name',
            'position'     => 'players.position',
            'jersey_number'=> 'players.jersey_number',
            'age'          => 'players.age',
            'height_in'    => 'players.height_in',
            'weight_lb'    => 'players.weight_lb',
            'experience_years' => 'players.experience_years',
            'college'      => 'players.college',
        ];

        $sortKey = $data['sort'] ?? 'touchdowns';
        $sortColumn = $sortMap[$sortKey] ?? 'touchdowns';

        $q = DB::table('players')
            ->leftJoinSub($statsSub, 'ps', function ($join) {
                $join->on('ps.player_id', '=', 'players.id');
            })
            ->select([
                'players.id as player_id',
                'players.first_name',
                'players.last_name',
                'players.position',
                'players.jersey_number',
                'players.status',
                'players.age',
                'players.height_in',
                'players.weight_lb',
                'players.experience_years',
                'players.college',
                'players.headshot_url',
                DB::raw((string) $season . ' as season'),
                DB::raw('COALESCE(ps.games_played, 0) as games_played'),
                DB::raw('COALESCE(ps.touchdowns, 0) as touchdowns'),
                DB::raw('COALESCE(ps.yards, 0) as yards'),
                DB::raw('COALESCE(ps.tackles, 0) as tackles'),
            ])
            ->when(($data['search'] ?? null), function ($query, $search) {
                $search = trim($search);
                $query->where(function ($w) use ($search) {
                    $w->where('players.first_name', 'like', "%{$search}%")
                      ->orWhere('players.last_name', 'like', "%{$search}%")
                      ->orWhere('players.jersey_number', 'like', "%{$search}%");
                });
            })
            ->when(($data['position'] ?? null), fn ($query, $pos) => $query->where('players.position', strtoupper($pos)))
            ->when(($data['status'] ?? null), fn ($query, $status) => $query->where('players.status', $status));

        if (in_array($sortKey, ['touchdowns', 'yards', 'tackles', 'games_played'], true)) {
            $q->orderBy(DB::raw($sortColumn), $order);
        } else {
            $q->orderBy($sortColumn, $order);
        }

        $q->orderBy('players.last_name', 'asc')
          ->orderBy('players.first_name', 'asc');

        return [$q, $sortKey];
    }
}
