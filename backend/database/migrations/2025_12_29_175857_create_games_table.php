<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();

            $table->date('game_date');
            $table->string('opponent', 120);
            
            $table->enum('location', ['home', 'away']);

            $table->unsignedSmallInteger('sf_score');
            $table->unsignedSmallInteger('opp_score');

            $table->string('venue', 120)->nullable();

            $table->timestamps();

            $table->index('game_date');
            $table->index(['game_date', 'opponent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
