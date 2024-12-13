<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function changeUsername(Request $request) {
        $request->validate([
            'username' => 'required|string|min:4|max:32|regex:/^[a-zA-Z0-9]{4,32}$/',
        ]);

        if(User::where('username', $request->input('username'))->exists()) {
            return response()->json(['message' => 'Username already taken'], 409);
        }

        $newUsername = $request->input('username');
        User::where('id', $request->user()->id)->update(['username' => $newUsername]);
        return response()->json(['message' => 'Username changed successfully'], 200);
    }
}
