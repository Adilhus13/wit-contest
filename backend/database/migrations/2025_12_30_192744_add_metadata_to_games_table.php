<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedSmallInteger('season')->nullable()->after('id');
            
            $table->string('opponent_city', 80)->nullable()->after('opponent');
            $table->string('opponent_name', 80)->nullable()->after('opponent_city');

            $table->enum('result', ['W', 'L'])->nullable()->after('opp_score');

            // keep venue but align naming with UI
            $table->string('stadium', 120)->nullable()->after('venue');

            $table->index('season');
            $table->index(['season', 'game_date']);
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropIndex(['season']);
            $table->dropIndex(['season', 'game_date']);

            $table->dropColumn([
                'season',
                'opponent_city',
                'opponent_name',
                'result',
                'stadium',
            ]);
        });
    }
};
