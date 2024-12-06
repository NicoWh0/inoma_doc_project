<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;

class RegisterController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:4|max:32|unique:users|regex:/^[a-zA-Z0-9]{4,32}$/',
            'email' => 'required|string|email|max:320|unique:users',
            'password' => 'required|string|min:10|max:16|regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,16}$/',
            'confirmPassword' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        //User creation
        return response()->json(['message'=> 'User registered successfully'],200);
    }
}
