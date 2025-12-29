<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerStat>
 */
class PlayerStatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'player_id' => Player::query()->inRandomOrder()->value('id') ?? Player::factory(),
            'season' => (int) now()->format('Y'),
            'games_played' => $this->faker->numberBetween(0, 17),
            'touchdowns' => 0,
            'yards' => 0,
            'tackles' => 0,
        ];
    }
}
