<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

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
                'location',
                'stadium',
                'opponent_city',
                'opponent_name',
                'result',
                'team_score',
                'opponent_score',
            ])
            ->orderByDesc('game_date');

        if ($season) {
            $q->where('season', $season);
        }

        $games = $q->limit($limit)->get()->map(function ($g) {
            return [
                'id' => $g->id,
                'season' => $g->season,
                'date' => optional($g->game_date)->format('F j, Y'),
                'stadium' => $g->stadium ?? $g->location,
                'opponentCity' => $g->opponent_city,
                'opponentName' => $g->opponent_name,
                'result' => strtoupper((string) $g->result) === 'W' ? 'W' : 'L',
                'score' => "{$g->team_score}-{$g->opponent_score}",
            ];
        });

        return response()->json(['data' => $games]);
    }
}
