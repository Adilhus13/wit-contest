<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $opponents = [
            'Seahawks','Rams','Cardinals','Cowboys','Eagles','Packers','Vikings','Saints',
            'Buccaneers','Steelers','Browns','Ravens','Bengals','Jaguars','Texans','Colts',
            'Chiefs','Bills','Dolphins','Jets','Giants','Commanders','Bears','Lions'
        ];

        $sf = $this->faker->numberBetween(10, 45);
        $opp = $this->faker->numberBetween(6, 42);

        return [
            'game_date' => $this->faker->dateTimeBetween('-18 months', 'now')->format('Y-m-d'),
            'opponent' => $this->faker->randomElement($opponents),
            'location' => $this->faker->randomElement(['home', 'away']),
            'sf_score' => $sf,
            'opp_score' => $opp,
            'venue' => $this->faker->randomElement([
                'Levi\'s Stadium',
                'SoFi Stadium',
                'Lumen Field',
                'AT&T Stadium',
                'Lincoln Financial Field',
                null,
            ]),
        ];
    }
}
