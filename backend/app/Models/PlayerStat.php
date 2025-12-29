<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerStat extends Model
{

    use HasFactory;

    protected $fillable = [
        'player_id',
        'season',
        'games_played',
        'touchdowns',
        'yards',
        'tackles',
    ];

    public function player(){
        return $this->belongsTo(Player::class);
    }
}
