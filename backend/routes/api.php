<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\GameController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::post('/auth/token', [AuthController::class, 'token'])->middleware('throttle:10,1');

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/leaderboard', [LeaderboardController::class, 'index']);
    Route::get('/games', [GameController::class, 'index']);
    Route::apiResource('/players', PlayerController::class);
});