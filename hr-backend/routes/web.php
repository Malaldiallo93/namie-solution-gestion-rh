<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Routes d'authentification Google (routes web pour les sessions)
Route::prefix('auth')->group(function () {
    Route::get('/google', [App\Http\Controllers\Auth\GoogleController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [App\Http\Controllers\Auth\GoogleController::class, 'handleGoogleCallback']);
});
