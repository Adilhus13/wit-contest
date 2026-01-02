<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardRowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'playerId' => (int) $this->player_id,
            'firstName' => $this->first_name,
            'lastName'  => $this->last_name,
            'position'  => $this->position,
            'jerseyNumber' => $this->jersey_number,
            'status' => $this->status,
            'age' => $this->age,
            'heightIn' => $this->height_in,
            'weightLb' => $this->weight_lb,
            'experienceYears' => $this->experience_years,
            'college' => $this->college,
            'headshotUrl' => $this->headshot_url,
            'season' => (int) $this->season,
            'gamesPlayed' => (int) $this->games_played,
            'touchdowns' => (int) $this->touchdowns,
            'yards' => (int) $this->yards,
            'tackles' => (int) $this->tackles,
        ];
    }
}
