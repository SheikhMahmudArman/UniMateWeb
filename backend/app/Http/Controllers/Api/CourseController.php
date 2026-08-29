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
        $request->validate([
            'code' => 'required|unique:courses,code',
            'name' => 'required',
            'credits' => 'required|numeric|min:0|max:10',
            'semester' => 'required|in:1.1,1.2,2.1,2.2,3.1,3.2,4.1,4.2',
            'hours_per_week' => 'nullable|string',
            'prerequisite' => 'nullable|string',
            'content_page' => 'nullable|integer',
        ]);

        $course = Course::create($request->all());

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

        $request->validate([
            'code' => 'required|unique:courses,code,' . $id,
            'name' => 'required',
            'credits' => 'required|numeric|min:0|max:10',
            'semester' => 'required|in:1.1,1.2,2.1,2.2,3.1,3.2,4.1,4.2',
            'hours_per_week' => 'nullable|string',
            'prerequisite' => 'nullable|string',
            'content_page' => 'nullable|integer',
        ]);

        $course->update($request->all());

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