<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameFactory extends Factory
{
    protected $model = Game::class;

    public function definition(): array
    {
        $sf = $this->faker->numberBetween(10, 45);
        $opp = $this->faker->numberBetween(6, 42);

        $teams = [
            ['city' => 'SEATTLE', 'name' => 'SEAHAWKS'],
            ['city' => 'LOS ANGELES', 'name' => 'RAMS'],
            ['city' => 'ARIZONA', 'name' => 'CARDINALS'],
            ['city' => 'PHILADELPHIA', 'name' => 'EAGLES'],
            ['city' => 'GREEN BAY', 'name' => 'PACKERS'],
            ['city' => 'BALTIMORE', 'name' => 'RAVENS'],
            ['city' => 'KANSAS CITY', 'name' => 'CHIEFS'],
        ];
        $oppTeam = $teams[array_rand($teams)];

        $date = $this->faker->dateTimeBetween('-18 months', 'now');

        $location = $this->faker->randomElement(['home', 'away']);

        return [
            'season' => (int) $date->format('Y'),
            'game_date' => $date->format('Y-m-d'),
            'opponent' => $oppTeam['name'],
            'opponent_city' => $oppTeam['city'],
            'opponent_name' => $oppTeam['name'],
            'location' => $location,
            'sf_score' => $sf,
            'opp_score' => $opp,
            'result' => $sf >= $opp ? 'W' : 'L',
            'venue' => $this->faker->randomElement(["Levi's Stadium", "SoFi Stadium", "Lumen Field", null]),
            'stadium' => $location === 'home' ? "Levi's Stadium" : $this->faker->randomElement(["SoFi Stadium", "Lumen Field", null]),
        ];
    }
}
