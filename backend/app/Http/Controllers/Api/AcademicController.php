<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Assignment, Quiz, Topic};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AcademicController extends Controller
{
    private function model(Request $request): string
    {
        return match ($request->route('resource')) {
            'quizzes' => Quiz::class,
            'assignments' => Assignment::class,
            'topics' => Topic::class,
        };
    }

    private function query(Request $request)
    {
        $query = ($this->model($request))::query()->with('course');
        $semester = $request->user()->role === 'admin'
            ? $request->query('semester') : $request->user()->student?->semester;
        if ($request->user()->role !== 'admin' && !$semester) {
            $query->whereRaw('1 = 0');
        } elseif ($semester) {
            $query->whereHas('course', fn ($q) => $q->where('semester', $semester));
        }
        return $query;
    }

    private function payload($item, Request $request): array
    {
        $data = $item->toArray();
        if (!$item instanceof Quiz) {
            $data['completed'] = $item->completedBy->contains('id', $request->user()->id);
            unset($data['completed_by']);
        }
        if ($item instanceof Assignment) {
            $data['has_file'] = (bool) $item->file_path;
        }
        return $data;
    }

    public function index(Request $request)
    {
        $query = $this->query($request);
        if ($request->filled('course_id')) $query->where('course_id', $request->query('course_id'));
        if ($this->model($request) !== Quiz::class) {
            $query->with(['completedBy' => fn ($q) => $q->where('users.id', $request->user()->id)]);
        }
        $column = match ($request->route('resource')) { 'topics' => 'order', 'quizzes' => 'date', default => 'due_date' };
        return response()->json(['success' => true, 'data' => $query->orderBy($column)->orderBy('id')->get()
            ->map(fn ($item) => $this->payload($item, $request))]);
    }

    private function validated(Request $request): array
    {
        $rules = ['course_id' => 'required|integer|exists:courses,id', 'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:10000'];
        $rules += match ($request->route('resource')) {
            'topics' => ['order' => 'required|integer|min:1|max:10000'],
            'quizzes' => ['date' => 'required|date_format:Y-m-d', 'time' => 'nullable|date_format:H:i',
                'room' => 'nullable|string|max:255', 'total_marks' => 'required|integer|min:1|max:10000'],
            'assignments' => ['due_date' => 'required|date_format:Y-m-d', 'total_marks' => 'required|integer|min:1|max:10000',
                'file' => 'nullable|file|mimes:pdf,doc,docx,zip|max:5120', 'remove_file' => 'sometimes|boolean'],
        };
        $data = $request->validate($rules);
        unset($data['file'], $data['remove_file']);
        return $data;
    }

    public function store(Request $request) { return $this->save($request); }
    public function update(Request $request, string $resource, int $id) { return $this->save($request, $id); }

    private function save(Request $request, ?int $id = null)
    {
        $item = $id ? ($this->model($request))::findOrFail($id) : new ($this->model($request));
        $data = $this->validated($request);
        $oldPath = $item instanceof Assignment ? $item->file_path : null;
        $newPath = null;
        if ($item instanceof Assignment) {
            if ($request->boolean('remove_file')) $data += ['file_path' => null, 'file_name' => null];
            if ($request->hasFile('file')) {
                $newPath = $request->file('file')->store('assignments', 'public');
                abort_unless(is_string($newPath) && $newPath !== '', 500, 'The attachment could not be stored. Check server storage permissions.');
                $data['file_path'] = $newPath;
                $data['file_name'] = $request->file('file')->getClientOriginalName();
            }
        }
        try { $item->fill($data)->save(); }
        catch (\Throwable $error) {
            if ($newPath) Storage::disk('public')->delete($newPath);
            throw $error;
        }
        if ($oldPath && $oldPath !== $item->file_path) Storage::disk('public')->delete($oldPath);
        return response()->json(['success' => true, 'data' => $this->payload($item->load('course'), $request)], $id ? 200 : 201);
    }

    public function destroy(Request $request, string $resource, int $id)
    {
        $item = ($this->model($request))::findOrFail($id);
        $path = $item instanceof Assignment ? $item->file_path : null;
        $item->delete();
        if ($path) Storage::disk('public')->delete($path);
        return response()->json(['success' => true]);
    }

    public function complete(Request $request, string $resource, int $id)
    {
        abort_if($resource === 'quizzes', 404);
        $data = $request->validate(['completed' => 'required|boolean']);
        $item = $this->query($request)->findOrFail($id);
        if ($data['completed']) $item->completedBy()->syncWithoutDetaching([$request->user()->id]);
        else $item->completedBy()->detach($request->user()->id);
        return response()->json(['success' => true, 'data' => ['completed' => $data['completed']]]);
    }

    public function download(Request $request, string $resource, int $id)
    {
        abort_unless($resource === 'assignments', 404);
        $item = $this->query($request)->findOrFail($id);
        abort_unless($item->file_path && Storage::disk('public')->exists($item->file_path), 404);
        return Storage::disk('public')->download($item->file_path, $item->file_name);
    }
}
