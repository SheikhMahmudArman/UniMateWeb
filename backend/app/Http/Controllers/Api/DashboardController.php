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
        $semester = $student?->semester;
        $academic = fn ($query) => $user->role === 'admin' ? $query : $query->whereHas('course', fn ($q) => $q->where('semester', $semester ?? '__none__'));

        // Quick Stats
        $stats = [
            'upcoming_quizzes' => $academic(\App\Models\Quiz::query())->whereDate('date', '>=', today())->count(),
            'pending_assignments' => $academic(\App\Models\Assignment::query())->whereDoesntHave('completedBy', fn ($q) => $q->where('users.id', $user->id))->count(),
            'current_cgpa' => $student ? $student->cgpa : 0,
        ];

        // Notices
        $notices = Notice::where('is_published', true)
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Routine
        $routine = Routine::when($user->role !== 'admin', fn ($q) => $q->where('semester', $semester ?? '__none__'))->get();

        // Courses with progress
        $courses = Course::with(['topicItems.completedBy' => fn ($q) => $q->where('users.id', $user->id)])
            ->when($user->role !== 'admin', fn ($q) => $q->where('semester', $semester ?? '__none__'))->get();
        $coursesData = [];
        foreach ($courses as $course) {
            $topics = $course->topicItems->map(fn ($topic) => ['id' => $topic->id, 'title' => $topic->title,
                'description' => $topic->description, 'completed' => $topic->completedBy->isNotEmpty()]);
            $coursesData[] = [
                'id' => $course->id,
                'code' => $course->code,
                'name' => $course->name,
                'topics' => $topics,
                'progress' => $topics->count() ? round($topics->where('completed', true)->count() / $topics->count() * 100) : 0,
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
