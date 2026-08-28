<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index()
    {
        $notices = Notice::where('is_published', true)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notices,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'type' => 'required|in:general,exam,event',
            'date' => 'required|date',
        ]);

        $notice = Notice::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $notice,
            'message' => 'Notice created successfully',
        ]);
    }

    public function show($id)
    {
        $notice = Notice::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $notice,
        ]);
    }

    public function update(Request $request, $id)
    {
        $notice = Notice::findOrFail($id);

        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'type' => 'required|in:general,exam,event',
            'date' => 'required|date',
        ]);

        $notice->update($request->all());

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