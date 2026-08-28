<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        $faculties = Faculty::all();
        return response()->json([
            'success' => true,
            'data' => $faculties,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'department' => 'required',
            'designation' => 'required',
            'email' => 'required|email|unique:faculties',
        ]);

        $faculty = Faculty::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $faculty,
            'message' => 'Faculty created successfully',
        ]);
    }

    public function show($id)
    {
        $faculty = Faculty::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $faculty,
        ]);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'department' => 'required',
            'designation' => 'required',
            'email' => 'required|email|unique:faculties,email,' . $id,
        ]);

        $faculty->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $faculty,
            'message' => 'Faculty updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();

        return response()->json([
            'success' => true,
            'message' => 'Faculty deleted successfully',
        ]);
    }
}