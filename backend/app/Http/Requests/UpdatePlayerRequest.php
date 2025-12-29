<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlayerRequest extends FormRequest
{
    public function rules(): array
    {
        $routePlayer = $this->route('player');
        $id = is_object($routePlayer) ? (int) $routePlayer->id : (int) $routePlayer;

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:80'],
            'last_name' => ['sometimes', 'required', 'string', 'max:80'],
            'position' => ['sometimes', 'required', 'string', 'max:10'],
            'jersey_number' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:99', "unique:players,jersey_number,{$id}"],
            'status' => ['sometimes', 'required', 'in:active,inactive'],

            'age' => ['sometimes', 'nullable', 'integer', 'min:18', 'max:60'],
            'height_in' => ['sometimes', 'nullable', 'integer', 'min:48', 'max:90'],
            'weight_lb' => ['sometimes', 'nullable', 'integer', 'min:120', 'max:450'],
            'experience_years' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:30'],
            'college' => ['sometimes', 'nullable', 'string', 'max:120'],
            'headshot_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ];
    }
}
