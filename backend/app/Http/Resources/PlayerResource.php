<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'playerId' => (int) $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'position' => $this->position,
            'jerseyNumber' => $this->jersey_number,
            'status' => $this->status,
            'age' => $this->age,
            'heightIn' => $this->height_in,
            'weightLb' => $this->weight_lb,
            'experienceYears' => $this->experience_years,
            'college' => $this->college,
            'headshotUrl' => $this->headshot_url,
            'createdAt' => optional($this->created_at)->toISOString(),
            'updatedAt' => optional($this->updated_at)->toISOString(),
        ];
    }
}
