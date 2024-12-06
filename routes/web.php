<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

//Per il client-side routing
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

Route::post('api/register', [RegisterController::class, 'register'])->name('register');
