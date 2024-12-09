<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Log;




Route::get('/send-test-mail', function () {
    Mail::to('nico.bianchetto@gmail.com')->send(new TestMail());
    return 'Test Email sent';
});



Route::post('api/register', [RegisterController::class, 'register'])->name('register');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/email-verified');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::get('/email/verify', function () {
    return response()->json(['message' => 'Please verify your email address.']);
})->middleware('auth')->name('verification.notice');

Route::post('/login', [LoginController::class, 'login'])->name('login');

//Per il client-side routing
Route::get('/{any}', function () {
    Log::info('Client-side routing for route: ' . request()->path());
    Log::info('Request body: ' . request()->getContent());
    return view('app');
})->where('any', '.*');

//Route::get('/login', [LoginController::class, 'loginRequest'])->name('login');

