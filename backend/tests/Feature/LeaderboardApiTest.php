<?php

namespace Tests\Feature;

use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeaderboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_leaderboard_requires_auth(): void
    {
        $res = $this->getJson('/api/leaderboard');
        $res->assertStatus(401);
    }

    public function test_leaderboard_returns_paginated_results_sorted_by_touchdowns_desc(): void
    {
        $user = User::query()->create([
            'name' => 'Test',
            'email' => 'test@local',
            'password' => bcrypt('secret'),
        ]);
        Sanctum::actingAs($user);

        $season = (int) now()->format('Y');

        $p1 = Player::query()->create([
            'first_name' => 'A',
            'last_name' => 'One',
            'position' => 'QB',
            'jersey_number' => 1,
            'status' => 'active',
        ]);
        $p2 = Player::query()->create([
            'first_name' => 'B',
            'last_name' => 'Two',
            'position' => 'RB',
            'jersey_number' => 2,
            'status' => 'active',
        ]);
        $p3 = Player::query()->create([
            'first_name' => 'C',
            'last_name' => 'Three',
            'position' => 'WR',
            'jersey_number' => 3,
            'status' => 'active',
        ]);

        PlayerStat::query()->create([
            'player_id' => $p1->id,
            'season' => $season,
            'games_played' => 17,
            'touchdowns' => 5,
            'yards' => 3000,
            'tackles' => 0,
        ]);
        PlayerStat::query()->create([
            'player_id' => $p2->id,
            'season' => $season,
            'games_played' => 17,
            'touchdowns' => 12,
            'yards' => 1200,
            'tackles' => 5,
        ]);
        PlayerStat::query()->create([
            'player_id' => $p3->id,
            'season' => $season,
            'games_played' => 17,
            'touchdowns' => 8,
            'yards' => 900,
            'tackles' => 2,
        ]);

        $res = $this->getJson("/api/leaderboard?season={$season}&sort=touchdowns&order=desc&limit=2");

        $res->assertOk()
            ->assertJsonStructure([
                'data',
                'links',
            ]);

        $data = $res->json('data');
        $this->assertCount(2, $data);

        // Top should be touchdowns=12 (player B Two)
        $this->assertSame(12, $data[0]['touchdowns']);
        $this->assertSame('Two', $data[0]['last_name']);
    }

    public function test_leaderboard_invalid_sort_falls_back_to_default(): void
    {
        $user = User::query()->create([
            'name' => 'Test',
            'email' => 'test@local',
            'password' => bcrypt('secret'),
        ]);
        Sanctum::actingAs($user);

        $season = (int) now()->format('Y');

        $p1 = Player::query()->create([
            'first_name' => 'A',
            'last_name' => 'One',
            'position' => 'QB',
            'jersey_number' => 10,
            'status' => 'active',
        ]);
        $p2 = Player::query()->create([
            'first_name' => 'B',
            'last_name' => 'Two',
            'position' => 'RB',
            'jersey_number' => 11,
            'status' => 'active',
        ]);

        PlayerStat::query()->create([
            'player_id' => $p1->id,
            'season' => $season,
            'games_played' => 10,
            'touchdowns' => 1,
            'yards' => 100,
            'tackles' => 0,
        ]);
        PlayerStat::query()->create([
            'player_id' => $p2->id,
            'season' => $season,
            'games_played' => 10,
            'touchdowns' => 9,
            'yards' => 200,
            'tackles' => 0,
        ]);

        $res = $this->getJson("/api/leaderboard?season={$season}&sort=__bad__&order=desc&limit=10");
        $res->assertOk()
            ->assertJsonStructure(['data', 'links']);

        $data = $res->json('data');
        $this->assertSame(9, $data[0]['touchdowns']);
        $this->assertSame('Two', $data[0]['last_name']);
    }
}
