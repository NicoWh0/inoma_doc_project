<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentationController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,md,doc,docx,odt,html,htm,rtf,xls,xlsx,ods,csv|max:5120',
            'title' => 'required|string|min:4|max:32',
            'description' => 'string|min:4|max:512',
            'category' => 'required|numeric|exists:categories,name',
            'users' => 'required|array',
            'users.*' => 'required|numeric|exists:users,id',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->storeAs('public/uploads', $fileName);

        Document::create([
            'user_id' => $request->user()->id,
            'title' => $request->input('title'),
            'category_id' => $request->input('category'),
            'file_path' => $fileName,
            'description' => $request->input('description'),
        ]);

        return response()->json(['message' => 'File uploaded successfully'], 200);
    }
}
