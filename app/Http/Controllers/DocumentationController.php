<?php

namespace App\Http\Controllers;

use App\Models\Document;
use DB;
use Illuminate\Http\Request;
use Log;
use Storage;

class DocumentationController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,md,doc,docx,odt,html,htm,rtf,xls,xlsx,ods,csv|max:5120',
            'title' => 'required|string|min:4|max:32',
            'description' => 'string|min:4|max:512',
            'category' => 'required|numeric|exists:categories,id',
            'users' => 'required|array',
            'users.*' => 'required|numeric|exists:users,id',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();

        DB::beginTransaction();

        try {
            $document = Document::create([
                'uploader' => $request->user()->id,
                'title' => $request->input('title'),
                'category_id' => $request->input('category'),
                'file_path' => $fileName,
                'description' => $request->input('description'),
            ]);

            $document->users()->attach($request->input('users'));

            $file->storeAs('uploads', $fileName);

            DB::commit();
            return response()->json(['message' => 'File uploaded successfully'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error uploading file: ' . $e->getMessage());

            if(Storage::exists('uploads/' . $fileName)) {
                Storage::delete('uploads/' . $fileName);
            }

            return response()->json(['message' => 'Error uploading file'], 500);
        }
    }
}
