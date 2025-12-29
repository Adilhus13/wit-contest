<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_date',
        'opponent',
        'location',
        'sf_score',
        'opp_score',
        'venue',
    ];
}
