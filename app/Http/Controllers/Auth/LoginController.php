<?php

namespace App\Http\Controllers\Auth;

use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'identifier' => 'required|string',
            'password'=> 'required|string',
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');
        $identifierType = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($identifierType, $identifier)->first();
        if(!$user) {
            return response()->json(['message'=> 'Invalid Username or Email'], 401);
        }

        Log::info('Login, User found: ' . $user->username);

        $credentials = [
            $identifierType => $identifier,
            'password'=> $password,
            'user_status'=> 1, //User is active
        ];

        if(Auth::attempt($credentials)) {
            Log::info('Login, Auth success');
            $request->session()->regenerate();
            return response()->json(
                [
                    'message' => 'Login successful',
                    'user' => $user->only('type', 'username', 'email'),
                ],
                200
            );
        }
        Log::info('Login, Auth failed');
        return response()->json(['message'=> 'Invalid Username of Email'],401);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        return response()->json(['message'=> 'Logout successfull'], 200);
    }
}
