<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'position',
        'jersey_number',
        'status'
    ];

    public function stats(){
        return $this->hasMany(PlayerStat::class);
    }
}
