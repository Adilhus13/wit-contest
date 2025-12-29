<?php

namespace Database\Seeders;

use App\Models\Player;
use App\Models\PlayerStat;
use Illuminate\Database\Seeder;

class PlayerStatSeeder extends Seeder
{
    public function run(): void
    {
        $currentYear = (int) env('SEED_SEASON', now()->format('Y'));
        $seasonsCount = (int) env('SEED_SEASONS', 25);
        $startYear = $currentYear - max($seasonsCount - 1, 0);

        PlayerStat::query()->truncate();

        for ($season = $startYear; $season <= $currentYear; $season++) {
            Player::query()
                ->select(['id', 'position'])
                ->chunkById(500, function ($players) use ($season) {
                    $rows = [];

                    foreach ($players as $p) {
                        $games = random_int(0, 17);

                        [$td, $yards, $tackles] = match ($p->position) {
                            'QB' => [random_int(5, 45), random_int(2000, 5200), random_int(0, 25)],
                            'RB' => [random_int(0, 20), random_int(200, 1800), random_int(0, 50)],
                            'WR', 'TE' => [random_int(0, 18), random_int(150, 1600), random_int(0, 30)],
                            'OL' => [random_int(0, 2), random_int(0, 50), random_int(0, 15)],
                            'DL', 'LB', 'CB', 'S' => [random_int(0, 6), random_int(0, 200), random_int(20, 160)],
                            'K', 'P' => [0, 0, 0],
                            default => [random_int(0, 10), random_int(0, 800), random_int(0, 80)],
                        };

                        $rows[] = [
                            'player_id' => $p->id,
                            'season' => $season,
                            'games_played' => $games,
                            'touchdowns' => $td,
                            'yards' => $yards,
                            'tackles' => $tackles,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    PlayerStat::query()->insert($rows);
                });
        }
    }
}
