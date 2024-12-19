<?php

namespace App\Http\Controllers;

use App\Models\Document;
use DB;
use Illuminate\Http\Request;
use Log;
use Storage;
use Validator;

class DocumentationController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,md,doc,docx,odt,html,htm,rtf,xls,xlsx,ods,csv|max:5120',
            'title' => 'required|string|unique:documents,title|min:4|max:32',
            'description' => 'nullable|string|min:4|max:512',
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

            $file->storeAs(env('STORE_PATH_UPLOADS'), $fileName);

            DB::commit();
            return response()->json(['message' => 'File uploaded successfully'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error uploading file: ' . $e->getMessage());

            if(Storage::exists(env('STORE_PATH_UPLOADS') .  $fileName)) {
                Storage::delete(env('STORE_PATH_UPLOADS') . $fileName);
            }

            return response()->json(['message' => 'Error uploading file'], 500);
        }
    }

    public function download(Request $request, $id)
    {
        $document = Document::find($id);
        Log::info('Download request');

        if(!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        if(!$document->users->contains($request->user()->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $filePath = storage_path(env('STORE_PATH_DOWNLOADS') . $document->file_path);
        Log::info('Download File path: ' . $filePath);

        if(!file_exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        Log::info('File exists');

        return response()->download($filePath, $document->title);
    }


    public function getPersonalDocuments(Request $request)
    {
        $filter = $request->query('category');
        $search = $request->query('search');

        $categoryValidator = Validator::make($request->all(), [
            'category' => 'nullable|numeric|exists:categories,id',
        ]);
        $searchValidator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:512',
        ]);
        $categoryValidator->validate();
        $searchValidator->validate();

        $query = Document::query();

        if($filter && $categoryValidator->passes()) {
            $query->where('category_id', $filter);
        }
        if($search && $searchValidator->passes()) {
            $query->where('title', 'like', "%$search%")->orWhere('description', 'like', "%$search%");
        }

        $documents = $query->whereHas('users', function($query) use ($request) {
            $query->where('users.id', $request->user()->id);
        })->orderByDesc('updated_at')->limit(10)->get();
        if($documents->isEmpty()) {
            return response()->json(['message' => 'No documents found'], 404);
        }
        return response()->json($documents, 200);
    }

}
