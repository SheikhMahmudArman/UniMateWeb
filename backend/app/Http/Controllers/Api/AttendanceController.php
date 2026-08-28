<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $studentId = $request->query('student_id');
        $courseId = $request->query('course_id');

        $query = Attendance::with(['student', 'course']);

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        $attendances = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $attendances,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent',
        ]);

        $attendance = Attendance::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'message' => 'Attendance recorded successfully',
        ]);
    }

    public function summary(Request $request)
    {
        $studentId = $request->query('student_id');

        if (!$studentId) {
            return response()->json([
                'success' => false,
                'message' => 'Student ID required',
            ], 400);
        }

        $attendances = Attendance::where('student_id', $studentId)->get();
        $total = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $percentage = $total > 0 ? round(($present / $total) * 100) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_classes' => $total,
                'present' => $present,
                'absent' => $total - $present,
                'percentage' => $percentage,
                'records' => $attendances,
            ],
        ]);
    }
}