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
    'jersey_number',
    'position',
    'height_in',
    'weight_lb',
    'age',
    'experience_years',
    'college',
    'status',
    'headshot_url',
    ];

    public function stats(){
        return $this->hasMany(PlayerStat::class);
    }
}
