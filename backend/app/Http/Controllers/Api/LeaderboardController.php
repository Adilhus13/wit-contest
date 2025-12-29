<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlayerStat;
use Illuminate\Http\Request;

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

        $season = $data['season'] ?? (int) now()->format('Y');
        $limit = $data['limit'] ?? 25;
        $order = $data['order'] ?? 'desc';

        $sortMap = [
            'touchdowns' => 'player_stats.touchdowns',
            'yards' => 'player_stats.yards',
            'tackles' => 'player_stats.tackles',
            'games_played' => 'player_stats.games_played',
            'last_name' => 'players.last_name',
            'position' => 'players.position',
            'jersey_number' => 'players.jersey_number',
        ];
        $sortKey = $data['sort'] ?? 'touchdowns';
        $sortColumn = $sortMap[$sortKey] ?? $sortMap['touchdowns'];

        $q = PlayerStat::query()
            ->join('players', 'players.id', '=', 'player_stats.player_id')
            ->where('player_stats.season', $season)
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
                'player_stats.season',
                'player_stats.games_played',
                'player_stats.touchdowns',
                'player_stats.yards',
                'player_stats.tackles',
            ])
            ->when(($data['search'] ?? null), function ($query, $search) {
                $search = trim($search);
                $query->where(function ($w) use ($search) {
                    $w->where('players.first_name', 'like', "%{$search}%")
                      ->orWhere('players.last_name', 'like', "%{$search}%");
                });
            })
            ->when(($data['position'] ?? null), fn ($query, $pos) => $query->where('players.position', strtoupper($pos)))
            ->when(($data['status'] ?? null), fn ($query, $status) => $query->where('players.status', $status))
            ->orderBy($sortColumn, $order)
            ->orderBy('players.last_name', 'asc')
            ->orderBy('players.first_name', 'asc');

        return response()->json($q->paginate($limit));
    }
}
