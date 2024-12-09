<?php

namespace App\Http\Controllers\Auth;

use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function login(Request $request) {
        $credentials = $request->only("email","password");

        if(Auth::attempt($credentials)) {
            $token = auth()->user()->createToken('client-token');
            $request->session()->regenerate();
            return response()->json(['token' => $token->plainTextToken], 200);
        }


        return response()->json(['message'=> 'Invalid Credentials'],401);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        return response()->json(['message'=> 'Logout successfull'], 200);
    }
}
