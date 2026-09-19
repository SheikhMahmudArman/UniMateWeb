<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::when($request->user()->role !== 'admin', fn($q) => $q->where('user_id', $request->user()->id))->get();
        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string|max:255|unique:students|unique:users',
            'name' => 'required',
            'email' => 'required|email|unique:users|unique:students',
            'semester' => 'required',
            'cgpa' => 'nullable|numeric|min:0|max:4',
        ]);

        $password = \Illuminate\Support\Str::random(20);
        $student = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $password) {
            // Create user account
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($password),
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

            return $student;
        });
        return response()->json([
            'success' => true,
            'data' => $student,
            'message' => 'Student created successfully',
            'temporary_password' => $password,
        ]);
    }

    public function show($id)
    {
        $student = Student::with('user')->findOrFail($id);
        abort_unless(request()->user()->role === 'admin' || $student->user_id === request()->user()->id, 403);
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
            'email' => 'required|email|unique:users,email,' . $student->user_id . '|unique:students,email,' . $student->id,
            'semester' => 'required',
            'cgpa' => 'nullable|numeric|min:0|max:4',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $student) {
            $student->update($request->only(['name', 'email', 'semester', 'cgpa']));

            // Update user
            $user = User::find($student->user_id);
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

        });
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
        \Illuminate\Support\Facades\DB::transaction(function () use ($student, $user) {
            if ($user) {
                $user->tokens()->delete();
                $user->delete();
            } else {
                $student->delete();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }
}