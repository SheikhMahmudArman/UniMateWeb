<?php

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
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    // Courses
    Route::apiResource('courses', CourseController::class);

    // Students (Admin only)
    Route::apiResource('students', StudentController::class);

    // Faculty
    Route::apiResource('faculty', FacultyController::class);

    // Documents
    Route::apiResource('documents', DocumentController::class);

    // Marks
    Route::apiResource('marks', MarkController::class);

    // Notices
    Route::apiResource('notices', NoticeController::class);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::get('/attendance/summary', [AttendanceController::class, 'summary']);

    // Library
    Route::apiResource('library', LibraryController::class);

    // Routine
    Route::get('/routine', [RoutineController::class, 'index']);
    Route::post('/routine', [RoutineController::class, 'store']);
    Route::put('/routine/{id}', [RoutineController::class, 'update']);
    Route::delete('/routine/{id}', [RoutineController::class, 'destroy']);
    Route::patch('/routine/{id}/toggle-notify', [RoutineController::class, 'toggleNotify']);
});