<?php

use Illuminate\Support\Facades\Route;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


Route::get('/send-test-mail', function () {
    Mail::to('nico.bianchetto@gmail.com')->send(new TestMail());
    return 'Test Email sent';
});

Route::get('/test-protected-route', function () {
    return 'You are authorized to view this page';
})->middleware('auth:sanctum');

Route::get('js/react-slideshow-image.esm.js.map', function (Request $request) {
    return response()->file(public_path('js/react-slideshow-image.esm.js.map'));
});

Route::post('/register', [RegisterController::class, 'register'])->name('register');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/email/verify/success');
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Verification link sent!');
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

Route::get('/email/verify', function () {
    return redirect('/email/verify/notice');
})->middleware('auth:sanctum')->name('verification.notice');

Route::post('/login', [LoginController::class, 'login'])->name('login');

Route::post('/login/2fa', [LoginController::class,'login2fa'])->name('login.2fa');

Route::post('/user/me/enable-2fa/request',
    [LoginController::class, 'enable2FARequest']
)->middleware('auth:sanctum')->name('enable2fa.request');

Route::post('/user/me/enable-2fa/verify',
[LoginController::class, 'enable2FAVerify']
)->middleware('auth:sanctum')->name('enable2fa.verify');

Route::post('/user/me/disable-2fa',
[LoginController::class, 'disable2FA']
)->middleware('auth:sanctum')->name('disable2fa');

Route::put('/user/me/change-username',
[UserController::class, 'changeUsername']
)->middleware('auth:sanctum')->name('changeUsername');

Route::delete('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/user/me', function (Request $request) {
    return $request->user()->only('type', 'username', 'email', 'email_verified', 'google2fa_enabled');
})->middleware('auth:sanctum');

Route::get('/documentation/upload/users',
    [UserController::class, 'getAvailableUsersForDocs']
)->middleware(['auth:sanctum', 'auth.admin']);

//Documentation sharing routes

Route::get('/documentation/docs/{id}',
    [DocumentationController::class, 'getDocument']
)->middleware('auth:sanctum');

Route::post('/documentation/docs',
    [DocumentationController::class, 'upload']
)->middleware(['auth:sanctum', 'auth.admin']);

Route::put('/documentation/docs/{id}',
    [DocumentationController::class, 'updateDocument']
)->middleware(['auth:sanctum', 'auth.admin']);

Route::get('/documentation/management/docs',
    [DocumentationController::class, 'getManagementDocuments']
)->middleware(['auth:sanctum', 'auth.admin']);

Route::get('/documentation/personal/docs',
    [DocumentationController::class, 'getPersonalDocuments']
)->middleware('auth:sanctum');

Route::get('/documentation/download/{id}',
    [DocumentationController::class, 'download']
)->middleware('auth:sanctum');

//Per il client-side routing
Route::get('/{any}', function () {
    Log::info('Client-side routing for route: ' . request()->path());
    Log::info('Request body: ' . request()->getContent());
    return view('app');
})->where('any', '.*');

