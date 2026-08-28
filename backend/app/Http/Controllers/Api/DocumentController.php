<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $semester = $request->query('semester');
        $courseId = $request->query('course_id');

        $query = Document::query();

        if ($semester) {
            $query->where('semester', $semester);
        }

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        $documents = $query->get();

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'type' => 'required',
            'semester' => 'required',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        $data = $request->only(['name', 'type', 'semester', 'url', 'course_id']);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');
            $data['file_path'] = $path;
        }

        $document = Document::create($data);

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document created successfully',
        ]);
    }

    public function show($id)
    {
        $document = Document::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $document,
        ]);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'type' => 'required',
            'semester' => 'required',
            'file' => 'nullable|file|max:10240',
        ]);

        $data = $request->only(['name', 'type', 'semester', 'url', 'course_id']);

        if ($request->hasFile('file')) {
            // Delete old file
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $path = $request->file('file')->store('documents', 'public');
            $data['file_path'] = $path;
        }

        $document->update($data);

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);

        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully',
        ]);
    }
}