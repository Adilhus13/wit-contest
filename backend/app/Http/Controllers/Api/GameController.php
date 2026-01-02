<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'season' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'limit'  => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $season = $validated['season'] ?? null;
        $limit  = $validated['limit'] ?? 12;

        $q = Game::query()
            ->select([
                'id',
                'season',
                'game_date',
                'opponent',
                'opponent_city',
                'opponent_name',
                'location',
                'sf_score',
                'opp_score',
                'result',
                'venue',
                'stadium',
                'logo_url'
            ])
            ->orderByDesc('game_date');

        if ($season !== null) {
            $q->where('season', $season);
        }

        $games = $q->limit($limit)->get()->map(function (Game $g) {
            $result = $g->result ?: (($g->sf_score >= $g->opp_score) ? 'W' : 'L');

            $oppCity = $g->opponent_city;
            $oppName = $g->opponent_name ?: (is_string($g->opponent) ? strtoupper($g->opponent) : null);

            return [
                'id' => $g->id,
                'season' => $g->season,
                'date' => Carbon::parse($g->game_date)->format('F d,Y'),
                'stadium' => $g->stadium ?? $g->venue,
                'opponentCity' => $oppCity,
                'opponentName' => $oppName,
                'result' => $result,
                'score' => "{$g->sf_score}-{$g->opp_score}",
                'location' => $g->location,
                'logoUrl' => $g->logo_url,
            ];
        });

        return response()->json(['data' => $games]);
    }
}
