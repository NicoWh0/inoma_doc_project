<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentUser;
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

    public function getDocument(Request $request, $id)
    {
        $document = Document::with('users')->find($id);

        if(!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        if(!$document->uploader === $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($document, 200);
    }

    public function getPersonalDocuments(Request $request)
    {
        return $this->getDocuments($request, function($query, $request) {
            return $query->whereHas('users', function($query) use ($request) {
                $query->where('users.id', $request->user()->id)->whereNull('document_user.deleted_at');
            })->orderByDesc('updated_at');
        });
    }

    public function getManagementDocuments(Request $request)
    {
        return $this->getDocuments($request, function($query, $request) {
            return $query->where('uploader', $request->user()->id)->orderByDesc('updated_at');
        });
    }

    private function getDocuments(Request $request, $getDocFunction) {
        $category = $request->query('category');
        $search = $request->query('search');
        $page = $request->query('page') ?? 1;
        $perPage = $request->query('perPage') ?? 10;

        $categoryValidator = Validator::make($request->all(), [
            'category' => 'nullable|numeric|exists:categories,id',
        ]);
        $searchValidator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:512',
        ]);
        $categoryValidator->validate();
        $searchValidator->validate();

        $query = Document::query();

        if($category && $categoryValidator->passes()) {
            $query->where('category_id', $category);
        }
        if($search && $searchValidator->passes()) {
            $query->where(function ($subquery) use ($search) {
                $subquery->where('title', 'like', "%$search%")->orWhere('description', 'like', "%$search%");
            });
        }

        $documents = $getDocFunction($query, $request)->paginate($perPage, ['*'], 'page', $page);;

        if($documents->isEmpty()) {
            return response()->json(['message' => 'No documents found'], 404);
        }
        return response()->json($documents, 200);
    }

    public function updateDocument(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|min:4|max:32',
            'description' => 'required|string|min:4|max:512',
            'category' => 'required|numeric|exists:categories,id',
            'users' => 'required|array',
            'users.*' => 'required|numeric|exists:users,id',
        ]);

        $document = Document::find($id);

        if(!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        if(!$document->uploader === $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();

        try {
            $title = $request->input('title');
            $description = $request->input('description');
            $categoryId = $request->input('category');
            $newUserIds = $request->input('users');

            $isDirty = false;

            if ($document->title !== $title) {
                $document->title = $title;
                $isDirty = true;
            }

            if ($document->description !== $description) {
                $document->description = $description;
                $isDirty = true;
            }

            if ($document->category_id !== $categoryId) {
                $document->category_id = $categoryId;
                $isDirty = true;
            }

            $existingUserIds = $document->users->pluck('id')->toArray();
            if (array_diff($newUserIds, $existingUserIds) || array_diff($existingUserIds, $newUserIds)) {
                // Soft delete existing associations
                DocumentUser::where('document_id', $document->id)->delete();

                // Attach new associations
                foreach ($newUserIds as $userId) {
                    DocumentUser::create([
                        'document_id' => $document->id,
                        'user_id' => $userId
                    ]);
                }

                $isDirty = true;
            }

            if ($isDirty) {
                $document->touch();
                $document->save();
            }

            DB::commit();
            return $isDirty ?
                response()->json(['message' => 'Document updated successfully'], 200) :
                response()->json(['message' => 'No changes made'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating document: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating document'], 500);
        }
    }

}
