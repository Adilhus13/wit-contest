<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $count = (int) env('SEED_GAMES', 40);

        // City + Name so UI can render like the design
        $opponents = [
            ['city' => 'SEATTLE',      'name' => 'SEAHAWKS'],
            ['city' => 'LOS ANGELES',  'name' => 'RAMS'],
            ['city' => 'ARIZONA',      'name' => 'CARDINALS'],
            ['city' => 'DALLAS',       'name' => 'COWBOYS'],
            ['city' => 'PHILADELPHIA', 'name' => 'EAGLES'],
            ['city' => 'GREEN BAY',    'name' => 'PACKERS'],
            ['city' => 'MINNESOTA',    'name' => 'VIKINGS'],
            ['city' => 'NEW ORLEANS',  'name' => 'SAINTS'],
            ['city' => 'TAMPA BAY',    'name' => 'BUCCANEERS'],
            ['city' => 'PITTSBURGH',   'name' => 'STEELERS'],
            ['city' => 'CLEVELAND',    'name' => 'BROWNS'],
            ['city' => 'BALTIMORE',    'name' => 'RAVENS'],
            ['city' => 'CINCINNATI',   'name' => 'BENGALS'],
            ['city' => 'JACKSONVILLE', 'name' => 'JAGUARS'],
            ['city' => 'HOUSTON',      'name' => 'TEXANS'],
            ['city' => 'INDIANAPOLIS', 'name' => 'COLTS'],
            ['city' => 'KANSAS CITY',  'name' => 'CHIEFS'],
            ['city' => 'BUFFALO',      'name' => 'BILLS'],
            ['city' => 'MIAMI',        'name' => 'DOLPHINS'],
            ['city' => 'NEW YORK',     'name' => 'JETS'],
            ['city' => 'NEW YORK',     'name' => 'GIANTS'],
            ['city' => 'WASHINGTON',   'name' => 'COMMANDERS'],
            ['city' => 'CHICAGO',      'name' => 'BEARS'],
            ['city' => 'DETROIT',      'name' => 'LIONS'],
            ['city' => 'LOS ANGELES',  'name' => 'CHARGERS'],
            ['city' => 'LAS VEGAS',    'name' => 'RAIDERS'],
            ['city' => 'NEW ENGLAND',  'name' => 'PATRIOTS'],
            ['city' => 'TENNESSEE',    'name' => 'TITANS'],
            ['city' => 'CAROLINA',     'name' => 'PANTHERS'],
            ['city' => 'ATLANTA',      'name' => 'FALCONS'],
        ];

        // Stadiums. For home games we default to Levi's unless explicitly set.
        $stadiums = [
            "Levi's Stadium",
            "SoFi Stadium",
            "Lumen Field",
            "AT&T Stadium",
            "Lincoln Financial Field",
            "Arrowhead Stadium",
            null,
        ];

        $start = now()->subMonths(18);

        $rows = [];
        for ($i = 0; $i < $count; $i++) {
            $sf = random_int(10, 45);
            $opp = random_int(6, 42);

            $date = $start->copy()->addDays(random_int(0, 540))->startOfDay();
            $location = random_int(0, 1) ? 'home' : 'away';

            $oppTeam = $opponents[array_rand($opponents)];

            $rows[] = [
                'season' => (int) $date->format('Y'), // simple + consistent

                'game_date' => $date->toDateString(),

                // legacy fallback string (keep it)
                'opponent' => $oppTeam['name'],

                // split fields for UI
                'opponent_city' => $oppTeam['city'],
                'opponent_name' => $oppTeam['name'],

                'location' => $location,

                'sf_score' => $sf,
                'opp_score' => $opp,

                // result stored
                'result' => $sf >= $opp ? 'W' : 'L',

                // keep venue, but prefer stadium for the UI
                'venue' => $stadiums[array_rand($stadiums)],
                'stadium' => $location === 'home' ? "Levi's Stadium" : ($stadiums[array_rand($stadiums)] ?? null),

                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Game::query()->truncate();
        Game::query()->insert($rows);
    }
}
