<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Validator;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:4|max:32|unique:users|regex:/^[a-zA-Z0-9]{4,32}$/',
            'email' => 'required|string|email|max:320|unique:users',
            'password' => 'required|string|min:10|max:16|regex:/^(?=.*\d)(?=.*[!?@#$%&-_\.,;:])(?=.*[A-Z])(?=.*[a-z]).{10,16}$/',
            'confirmPassword' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        //User creation
        $user = User::create([
            'username'=> $request->username,
            'email'=> $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message'=> 'User registered successfully. Please check your email to verify your account.',
            'user'=> $user->only('username', 'type', 'email', 'email_verified'),
        ], 201);
    }
}
