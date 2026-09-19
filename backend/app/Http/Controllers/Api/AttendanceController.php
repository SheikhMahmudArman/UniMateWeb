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
        $studentId = $request->user()->role === 'admin'
            ? $request->query('student_id')
            : (Student::where('user_id', $request->user()->id)->value('id') ?? -1);
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
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent',
        ]);

        $attendance = \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            Student::whereKey($data['student_id'])->lockForUpdate()->firstOrFail();
            return Attendance::updateOrCreate(collect($data)->only(['student_id', 'course_id', 'date'])->all(), ['status' => $data['status']]);
        });

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'message' => 'Attendance recorded successfully',
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate(['status' => 'required|in:present,absent']);
        $attendance = Attendance::findOrFail($id);
        $attendance->update($data);
        return response()->json(['success' => true, 'data' => $attendance]);
    }

    public function destroy($id)
    {
        Attendance::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function summary(Request $request)
    {
        $studentId = $request->user()->role === 'admin'
            ? $request->query('student_id')
            : (Student::where('user_id', $request->user()->id)->value('id') ?? -1);

        if (!$studentId) {
            return response()->json([
                'success' => false,
                'message' => 'Student ID required',
            ], 400);
        }

        $attendances = Attendance::with('course')->where('student_id', $studentId)->get();
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