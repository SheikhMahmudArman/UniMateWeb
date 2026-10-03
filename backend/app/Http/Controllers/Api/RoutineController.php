<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Routine;
use Illuminate\Http\Request;

class RoutineController extends Controller
{
    public function index(Request $request)
    {
        $query = Routine::query();
        $semester = $request->user()->role === 'admin' ? $request->query('semester') : $request->user()->student?->semester;
        if ($semester) $query->where('semester', $semester);
        elseif ($request->user()->role !== 'admin') $query->whereRaw('1 = 0');
        $routine = $query->orderBy('day')->orderBy('time')->get();

        return response()->json([
            'success' => true,
            'data' => $routine,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'semester' => 'required|string|exists:semesters,code',
            'notify' => 'sometimes|boolean',
            'time' => 'required|string|max:255',
            'course_code' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'day' => 'required|in:Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
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
            'semester' => 'required|string|exists:semesters,code',
            'notify' => 'sometimes|boolean',
            'time' => 'required|string|max:255',
            'course_code' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'day' => 'required|in:Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
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
