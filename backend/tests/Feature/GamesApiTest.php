<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GamesApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_games_requires_auth(): void
    {
        $this->getJson('/api/games')->assertStatus(401);
    }

    public function test_games_returns_list(): void
    {
        $user = User::factory()->create();
        Game::factory()->count(3)->create(['season' => 2023]);

        $this->actingAs($user)
            ->getJson('/api/games?season=2023&limit=2')
            ->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(2, 'data');
    }
}
