<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query();

        // Optional semester filter
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $courses = $query
            ->orderBy('code')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|unique:courses,code',
            'name' => 'required',
            'credits' => 'required|numeric|min:0|max:10',
            'semester' => 'required|string|exists:semesters,code',
            'hours_per_week' => 'nullable|string',
            'topics' => 'sometimes|array',
            'topics.*' => 'string|max:255',
            'prerequisite' => 'nullable|string'
        ]);

        $course = Course::create($data);

        return response()->json([
            'success' => true,
            'data' => $course,
            'message' => 'Course created successfully',
        ]);
    }

    public function show($id)
    {
        $course = Course::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $course,
        ]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $data = $request->validate([
            'code' => 'required|unique:courses,code,' . $id,
            'name' => 'required',
            'credits' => 'required|numeric|min:0|max:10',
            'semester' => 'required|string|exists:semesters,code',
            'hours_per_week' => 'nullable|string',
            'topics' => 'sometimes|array',
            'topics.*' => 'string|max:255',
            'prerequisite' => 'nullable|string',
        ]);

        $course->update($data);

        return response()->json([
            'success' => true,
            'data' => $course,
            'message' => 'Course updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully',
        ]);
    }
}