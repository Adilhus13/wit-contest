<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_token_endpoint_returns_bearer_token_for_valid_credentials(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@leaderboard.local',
            'password' => Hash::make('password123'),
        ]);

        $res = $this->postJson('/api/auth/token', [
            'email' => 'admin@leaderboard.local',
            'password' => 'password123',
            'device_name' => 'test',
        ]);

        $res->assertOk()
            ->assertJsonStructure(['token', 'token_type'])
            ->assertJson(['token_type' => 'Bearer']);

        $this->assertNotEmpty($res->json('token'));
    }

    public function test_token_endpoint_rejects_invalid_credentials(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@leaderboard.local',
            'password' => Hash::make('password123'),
        ]);

        $res = $this->postJson('/api/auth/token', [
            'email' => 'admin@leaderboard.local',
            'password' => 'wrong',
        ]);

        $res->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
