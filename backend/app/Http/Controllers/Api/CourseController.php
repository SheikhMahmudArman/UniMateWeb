<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:courses',
            'name' => 'required',
            'credits' => 'required|integer|min:1|max:4',
            'semester' => 'required',
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
            'credits' => 'required|integer|min:1|max:4',
            'semester' => 'required',
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