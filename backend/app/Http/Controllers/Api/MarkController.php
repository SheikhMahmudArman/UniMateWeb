<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;

class MarkController extends Controller
{
    public function index(Request $request)
    {
        $studentId = $request->user()->role === 'admin'
            ? $request->query('student_id')
            : (Student::where('user_id', $request->user()->id)->value('id') ?? -1);
        $semester = $request->query('semester');

        $query = Mark::with(['student', 'course']);

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        if ($semester) {
            $query->where('semester', $semester);
        }

        $marks = $query->get();

        return response()->json([
            'success' => true,
            'data' => $marks,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'semester' => 'required',
            'quiz' => 'sometimes|integer|min:0|max:30',
            'mid' => 'sometimes|integer|min:0|max:30',
            'online' => 'sometimes|integer|min:0|max:10',
            'final' => 'sometimes|integer|min:0|max:30',
        ]);

        $mark = \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            Student::whereKey($data['student_id'])->lockForUpdate()->firstOrFail();
            $exists = Mark::where('student_id', $data['student_id'])->where('course_id', $data['course_id'])->where('semester', $data['semester'])->exists();
            if ($exists)
                throw \Illuminate\Validation\ValidationException::withMessages(['course_id' => ['Marks already exist. Edit the existing row.']]);
            return Mark::create($data);
        });

        // Update student CGPA
        $this->updateStudentCGPA($request->student_id);

        return response()->json([
            'success' => true,
            'data' => $mark,
            'message' => 'Marks created successfully',
        ]);
    }

    public function show($id)
    {
        $mark = Mark::with(['student', 'course'])->findOrFail($id);
        abort_unless(request()->user()->role === 'admin' || $mark->student?->user_id === request()->user()->id, 403);
        return response()->json([
            'success' => true,
            'data' => $mark,
        ]);
    }

    public function update(Request $request, $id)
    {
        $mark = Mark::findOrFail($id);

        $data = $request->validate([
            'quiz' => 'sometimes|integer|min:0|max:30',
            'mid' => 'sometimes|integer|min:0|max:30',
            'online' => 'sometimes|integer|min:0|max:10',
            'final' => 'sometimes|integer|min:0|max:30',
        ]);

        $mark->update($data);

        // Update student CGPA
        $this->updateStudentCGPA($mark->student_id);

        return response()->json([
            'success' => true,
            'data' => $mark,
            'message' => 'Marks updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $mark = Mark::findOrFail($id);
        $studentId = $mark->student_id;
        $mark->delete();

        // Update student CGPA
        $this->updateStudentCGPA($studentId);

        return response()->json([
            'success' => true,
            'message' => 'Marks deleted successfully',
        ]);
    }

    private function updateStudentCGPA($studentId)
    {
        $student = Student::find($studentId);
        if (!$student)
            return;

        $marks = Mark::with('course')->where('student_id', $studentId)->get();

        if ($marks->isEmpty()) {
            $student->update(['cgpa' => 0]);
            return;
        }

        $totalPoints = 0;
        $totalCredits = 0;

        foreach ($marks as $mark) {
            $course = $mark->course;
            $totalMarks = $mark->quiz + $mark->mid + $mark->online + $mark->final;
            $gradePoint = $this->calculateGradePoint($totalMarks);
            $totalPoints += $gradePoint * $course->credits;
            $totalCredits += $course->credits;
        }

        $cgpa = $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0;
        $student->update(['cgpa' => $cgpa]);
    }

    private function calculateGradePoint($marks)
    {
        if ($marks >= 80)
            return 4.0;
        if ($marks >= 75)
            return 3.75;
        if ($marks >= 70)
            return 3.5;
        if ($marks >= 65)
            return 3.25;
        if ($marks >= 60)
            return 3.0;
        if ($marks >= 55)
            return 2.75;
        if ($marks >= 50)
            return 2.5;
        if ($marks >= 45)
            return 2.25;
        if ($marks >= 40)
            return 2.0;
        return 0;
    }
}