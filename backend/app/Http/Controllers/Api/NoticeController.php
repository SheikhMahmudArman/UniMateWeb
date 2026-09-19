<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index()
    {
        $notices = Notice::when(request()->user()->role !== 'admin', fn($q) => $q->where('is_published', true))
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notices,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'is_published' => 'sometimes|boolean',
            'title' => 'required|string|max:255',
            'content' => 'required',
            'type' => 'required|in:general,exam,event',
            'date' => 'required|date',
        ]);

        $notice = Notice::create($data);

        return response()->json([
            'success' => true,
            'data' => $notice,
            'message' => 'Notice created successfully',
        ]);
    }

    public function show($id)
    {
        $notice = Notice::findOrFail($id);
        abort_unless(request()->user()->role === 'admin' || $notice->is_published, 404);
        return response()->json([
            'success' => true,
            'data' => $notice,
        ]);
    }

    public function update(Request $request, $id)
    {
        $notice = Notice::findOrFail($id);

        $data = $request->validate([
            'is_published' => 'sometimes|boolean',
            'title' => 'required|string|max:255',
            'content' => 'required',
            'type' => 'required|in:general,exam,event',
            'date' => 'required|date',
        ]);

        $notice->update($data);

        return response()->json([
            'success' => true,
            'data' => $notice,
            'message' => 'Notice updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $notice = Notice::findOrFail($id);
        $notice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notice deleted successfully',
        ]);
    }
}