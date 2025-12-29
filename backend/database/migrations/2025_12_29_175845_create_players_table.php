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
        Schema::create('players', function (Blueprint $table) {
            $table->id();

            $table->string('first_name', 80);
            $table->string('last_name', 80);

            $table->string('position', 10);

            $table->unsignedSmallInteger('jersey_number')->nullable()->unique();
            
            $table->unsignedTinyInteger('age')->nullable();
            $table->unsignedSmallInteger('height_in')->nullable();
            $table->unsignedSmallInteger('weight_lb')->nullable();
            $table->unsignedTinyInteger('experience_years')->nullable();

            $table->string('college', 120)->nullable();
            $table->string('headshot_url', 255)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->timestamps();

            $table->index(['last_name', 'first_name']);
            $table->index('position');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
