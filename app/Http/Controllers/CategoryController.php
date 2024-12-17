<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:4|max:32|unique:categories',
        ]);

        Category::create([
            'name' => $request->input('name'),
        ]);

        return response()->json(['message' => 'Category created successfully'], 201);
    }

    public function getAll()
    {
        $categories = Category::whereNull('deleted_at')->pluck('name', 'id');
        return response()->json($categories, 200);
    }
}
