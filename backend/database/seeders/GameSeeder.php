<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $count = (int) env('SEED_GAMES', 40);

        $opponents = [
            'Seahawks','Rams','Cardinals','Cowboys','Eagles','Packers','Vikings','Saints',
            'Buccaneers','Steelers','Browns','Ravens','Bengals','Jaguars','Texans','Colts',
            'Chiefs','Bills','Dolphins','Jets','Giants','Commanders','Bears','Lions','Chargers',
            'Raiders','Patriots','Titans','Panthers','Falcons'
        ];

        $venues = [
            "Levi's Stadium",
            'SoFi Stadium',
            'Lumen Field',
            'AT&T Stadium',
            'Lincoln Financial Field',
            'Arrowhead Stadium',
            null,
        ];

        $start = now()->subMonths(18);

        $rows = [];
        for ($i = 0; $i < $count; $i++) {
            $sf = random_int(10, 45);
            $opp = random_int(6, 42);

            $rows[] = [
                'game_date' => $start->copy()->addDays(random_int(0, 540))->toDateString(),
                'opponent' => $opponents[array_rand($opponents)],
                'location' => random_int(0, 1) ? 'home' : 'away',
                'sf_score' => $sf,
                'opp_score' => $opp,
                'venue' => $venues[array_rand($venues)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Game::query()->truncate();
        Game::query()->insert($rows);
    }
}
