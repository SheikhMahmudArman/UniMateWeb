<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Routine;
use Illuminate\Http\Request;

class RoutineController extends Controller
{
    public function index()
    {
        $routine = Routine::orderBy('day')->orderBy('time')->get();

        return response()->json([
            'success' => true,
            'data' => $routine,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'notify' => 'sometimes|boolean',
            'time' => 'required|string|max:255',
            'course_code' => 'required',
            'course_name' => 'required',
            'room' => 'required',
            'day' => 'required',
        ]);

        $routine = Routine::create($data);

        return response()->json([
            'success' => true,
            'data' => $routine,
            'message' => 'Routine item created successfully',
        ]);
    }

    public function update(Request $request, $id)
    {
        $routine = Routine::findOrFail($id);

        $data = $request->validate([
            'notify' => 'sometimes|boolean',
            'time' => 'required|string|max:255',
            'course_code' => 'required',
            'course_name' => 'required',
            'room' => 'required',
            'day' => 'required',
        ]);

        $routine->update($data);

        return response()->json([
            'success' => true,
            'data' => $routine,
            'message' => 'Routine item updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $routine = Routine::findOrFail($id);
        $routine->delete();

        return response()->json([
            'success' => true,
            'message' => 'Routine item deleted successfully',
        ]);
    }

    public function toggleNotify($id)
    {
        $routine = Routine::findOrFail($id);
        $routine->update(['notify' => !$routine->notify]);

        return response()->json([
            'success' => true,
            'data' => $routine,
            'message' => 'Notification toggled successfully',
        ]);
    }
}