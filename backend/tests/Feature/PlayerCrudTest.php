<?php

namespace Tests\Feature;

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlayerCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_players_crud_happy_path(): void
    {
        $user = User::query()->create([
            'name' => 'Test',
            'email' => 'test@local',
            'password' => bcrypt('secret'),
        ]);
        Sanctum::actingAs($user);

        $create = $this->postJson('/api/players', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'position' => 'QB',
            'jersey_number' => 99,
            'status' => 'active',
            'age' => 25,
            'height_in' => 74,
            'weight_lb' => 220,
            'experience_years' => 3,
            'college' => 'Test U',
            'headshot_url' => 'https://example.com/headshot.png',
        ]);

        $create->assertStatus(201)
            ->assertJsonFragment(['first_name' => 'John', 'last_name' => 'Doe']);

        $playerId = $create->json('id');
        $this->assertNotEmpty($playerId);

        $show = $this->getJson("/api/players/{$playerId}");
        $show->assertOk()
            ->assertJsonFragment(['id' => $playerId, 'jersey_number' => 99]);

        $update = $this->putJson("/api/players/{$playerId}", [
            'last_name' => 'Updated',
            'status' => 'inactive',
        ]);

        $update->assertOk()
            ->assertJsonFragment(['last_name' => 'Updated', 'status' => 'inactive']);

        $index = $this->getJson('/api/players?search=Updated&limit=10');
        $index->assertOk()
            ->assertJsonStructure(['data', 'links']);

        $this->assertGreaterThanOrEqual(1, count($index->json('data')));

        $del = $this->deleteJson("/api/players/{$playerId}");
        $del->assertNoContent();

        $this->assertNull(Player::query()->find($playerId));
    }

    public function test_players_requires_auth(): void
    {
        $res = $this->getJson('/api/players');
        $res->assertStatus(401);
    }
}
