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
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('player_id')->constrained('players')->cascadeOnDelete();

            $table->unsignedSmallInteger('season');
            $table->unsignedSmallInteger('games_played')->default(0);
            
            $table->unsignedSmallInteger('touchdowns')->default(0);
            $table->unsignedInteger('yards')->default(0);
            $table->unsignedSmallInteger('tackles')->default(0);

            $table->timestamps();

            $table->unique(['player_id', 'season']);

            $table->index('season');
            $table->index(['season', 'touchdowns']);
            $table->index(['season', 'yards']);
            $table->index(['season', 'tackles']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};
