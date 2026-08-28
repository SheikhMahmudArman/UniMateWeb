<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Notice;
use App\Models\Routine;
use App\Models\Mark;
use App\Models\Attendance;
use App\Models\Library;
use App\Models\Student;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        // Quick Stats
        $stats = [
            'upcoming_quizzes' => 2,
            'pending_assignments' => 3,
            'current_cgpa' => $student ? $student->cgpa : 0,
        ];

        // Notices
        $notices = Notice::where('is_published', true)
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Routine
        $routine = Routine::all();

        // Courses with progress
        $courses = Course::where('semester', $student ? $student->semester : '1.1')->get();
        $coursesData = [];
        foreach ($courses as $course) {
            $topics = $course->topics ?? [];
            $coursesData[] = [
                'id' => $course->id,
                'code' => $course->code,
                'name' => $course->name,
                'topics' => $topics,
                'progress' => count($topics) > 0 ? rand(0, 100) : 0,
            ];
        }

        // Attendance summary
        $attendances = Attendance::where('student_id', $student ? $student->id : 0)->get();
        $totalClasses = $attendances->count();
        $presentClasses = $attendances->where('status', 'present')->count();
        $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100) : 0;

        // Library stats
        $availableBooks = Library::where('status', 'available')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'notices' => $notices,
                'routine' => $routine,
                'courses' => $coursesData,
                'attendance' => [
                    'percentage' => $attendancePercentage,
                    'total' => $totalClasses,
                    'present' => $presentClasses,
                ],
                'library' => [
                    'available_books' => $availableBooks,
                ],
            ],
        ]);
    }
}