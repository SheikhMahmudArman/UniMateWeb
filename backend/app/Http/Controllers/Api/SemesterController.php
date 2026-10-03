<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SemesterController extends Controller
{
    public function index() { return response()->json(['success' => true, 'data' => Semester::orderBy('code')->get()]); }
    public function store(Request $request) { return $this->save($request, new Semester); }
    public function update(Request $request, int $id) { return $this->save($request, Semester::findOrFail($id)); }

    private function save(Request $request, Semester $semester)
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:20', 'regex:/^[A-Za-z0-9][A-Za-z0-9._-]*$/', Rule::unique('semesters')->ignore($semester->id)],
            'name' => 'required|string|max:255', 'drive_url' => 'nullable|url:http,https|max:2048', 'is_active' => 'sometimes|boolean']);
        if ($semester->exists && $data['code'] !== $semester->code) {
            throw ValidationException::withMessages(['code' => 'Semester codes cannot be renamed. Edit the name or drive link instead.']);
        }
        $semester->fill($data)->save();
        return response()->json(['success' => true, 'data' => $semester]);
    }

    public function destroy(int $id)
    {
        $semester = Semester::findOrFail($id);
        foreach (['courses', 'students', 'documents', 'routines', 'marks'] as $table) {
            if (DB::table($table)->where('semester', $semester->code)->exists()) {
                throw ValidationException::withMessages(['semester' => 'Move or remove the semester records before deleting this folder.']);
            }
        }
        $semester->delete();
        return response()->json(['success' => true]);
    }
}
