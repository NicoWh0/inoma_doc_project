<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

Route::get('/pdf/easy_profit.pdf', function () {
    return response()->file(public_path('pdf/easy_profit.pdf'));
});

Route::get('/pdf/privacy.pdf', function () {
    return response()->file(public_path('pdf/privacy.pdf'));
});
