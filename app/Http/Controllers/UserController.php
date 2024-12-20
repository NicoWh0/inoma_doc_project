<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Log;

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

    public function getAvailableUsersForDocs(Request $request) {
        $search = $request->query('search');

        if($search && strlen($search) > 320) {
            return response()->json(['message' => 'Search query too long'], 422);
        }

        $query = User::where('type', '<=', 1)
            ->where('user_status', 1)
            ->where('email_verified_at', '!=', null);
            //->where('id', '!=', $request->user()->id); //Uncomment this line to exclude the current user from the search

        if ($search) {
            $query->where(function($subquery) use ($search) {
                $subquery->where('username', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        $users = $query->orderByDesc('created_at')
            ->limit(20)
            ->select('id', 'username', 'email')
            ->get();

        return count($users) === 0 ? response()->json(['message' => 'No users found'], 404) : response()->json($users, 200);
    }
}
