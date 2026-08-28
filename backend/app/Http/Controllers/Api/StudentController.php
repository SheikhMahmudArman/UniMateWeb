<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();
        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|unique:students',
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'semester' => 'required',
            'cgpa' => 'nullable|numeric|min:0|max:4',
        ]);

        // Create user account
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('student123'),
            'role' => 'student',
            'student_id' => $request->student_id,
        ]);

        $student = Student::create([
            'student_id' => $request->student_id,
            'name' => $request->name,
            'email' => $request->email,
            'semester' => $request->semester,
            'cgpa' => $request->cgpa ?? 0,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $student,
            'message' => 'Student created successfully',
        ]);
    }

    public function show($id)
    {
        $student = Student::with('user')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $student,
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $student->user_id,
            'semester' => 'required',
            'cgpa' => 'nullable|numeric|min:0|max:4',
        ]);

        $student->update($request->all());

        // Update user
        $user = User::find($student->user_id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'success' => true,
            'data' => $student,
            'message' => 'Student updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $user = User::find($student->user_id);
        $student->delete();
        if ($user) {
            $user->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }
}