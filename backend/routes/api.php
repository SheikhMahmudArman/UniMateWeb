<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\MarkController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\RoutineController;
use App\Http\Controllers\Api\ProfileController;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,1');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/semesters', function () {
        return response()->json(['success' => true, 'data' => \App\Models\Semester::orderBy('code')->get()]);
    });
    Route::put('/attendance/{id}', [AttendanceController::class, 'update'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    // Courses
    Route::apiResource('courses', CourseController::class)->only(['index', 'show']);
    Route::apiResource('courses', CourseController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Students (Admin only)
    Route::apiResource('students', StudentController::class)->only(['index', 'show']);
    Route::apiResource('students', StudentController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Faculty
    Route::apiResource('faculty', FacultyController::class)->only(['index', 'show']);
    Route::apiResource('faculty', FacultyController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Documents
    Route::apiResource('documents', DocumentController::class)->only(['index', 'show']);
    Route::apiResource('documents', DocumentController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Marks
    Route::apiResource('marks', MarkController::class)->only(['index', 'show']);
    Route::apiResource('marks', MarkController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Notices
    Route::apiResource('notices', NoticeController::class)->only(['index', 'show']);
    Route::apiResource('notices', NoticeController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    Route::get('/attendance/summary', [AttendanceController::class, 'summary']);

    // Library
    Route::apiResource('library', LibraryController::class)->only(['index', 'show']);
    Route::apiResource('library', LibraryController::class)->only(['store', 'update', 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);

    // Routine
    Route::get('/routine', [RoutineController::class, 'index']);
    Route::post('/routine', [RoutineController::class, 'store'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    Route::put('/routine/{id}', [RoutineController::class, 'update'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    Route::delete('/routine/{id}', [RoutineController::class, 'destroy'])->middleware(\App\Http\Middleware\RequireAdmin::class);
    Route::patch('/routine/{id}/toggle-notify', [RoutineController::class, 'toggleNotify'])->middleware(\App\Http\Middleware\RequireAdmin::class);
});
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();

        return response()->json([
            'status' => 'ok',
            'database' => 'connected'
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'database' => 'disconnected'
        ], 500);
    }
});
