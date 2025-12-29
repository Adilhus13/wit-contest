<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'position' => ['required', 'string', 'max:10'],
            'jersey_number' => ['nullable', 'integer', 'min:0', 'max:99', 'unique:players,jersey_number'],
            'status' => ['required', 'in:active,inactive'],

            'age' => ['nullable', 'integer', 'min:18', 'max:60'],
            'height_in' => ['nullable', 'integer', 'min:48', 'max:90'],
            'weight_lb' => ['nullable', 'integer', 'min:120', 'max:450'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:30'],
            'college' => ['nullable', 'string', 'max:120'],
            'headshot_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
