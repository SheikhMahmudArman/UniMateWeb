<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $student = Student::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'student_id' => $user->student_id,
                'semester' => $student ? $student->semester : null,
                'cgpa' => $student ? $student->cgpa : null,
                'has_profile_photo' => (bool) $user->profile_photo_path,
            ],
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $oldPath = $user->profile_photo_path;
        // Keep each account's files in its own directory. The authenticated
        // user remains the only source of ownership for this upload.
        $path = $request->file('photo')->store("profile-photos/{$user->id}", 'public');

        $user->update(['profile_photo_path' => $path]);

        if ($oldPath && ! User::where('profile_photo_path', $oldPath)
            ->where('id', '!=', $user->id)
            ->exists()) {
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully.',
        ]);
    }

    public function photo(Request $request)
    {
        $path = $request->user()->profile_photo_path;
        abort_unless($path && Storage::disk('public')->exists($path), 404, 'Profile picture not found.');

        $disk = Storage::disk('public');

        return response($disk->get($path), 200, [
            'Content-Type' => $disk->mimeType($path) ?: 'application/octet-stream',
            // This URL is shared by all accounts, so never let a browser or
            // intermediary reuse one user's private image for another user.
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Vary' => 'Authorization',
        ]);
    }

    public function deletePhoto(Request $request)
    {
        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
            $user->update(['profile_photo_path' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile picture removed successfully.',
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required',
            'email' => ['required', 'email', \Illuminate\Validation\Rule::unique('users')->ignore($user->id), \Illuminate\Validation\Rule::unique('students')->ignore($user->student?->id)],
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            // Update student record if exists
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                $student->update([
                    'name' => $request->name,
                    'email' => $request->email,
                ]);
            }

        });
        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Profile updated successfully',
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        $currentTokenId = $user->currentAccessToken()?->id;
        $user->tokens()->when($currentTokenId, fn($q) => $q->where('id', '!=', $currentTokenId))->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }
}