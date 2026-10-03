<?php

use App\Models\{Assignment, Attendance, Course, Routine, Semester, Student, Topic, User};
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

function academicStudent(string $semester = '1.1'): User
{
    $user = User::factory()->create(['role' => 'student']);
    Student::create(['user_id' => $user->id, 'student_id' => 'S'.$user->id, 'name' => $user->name,
        'email' => $user->email, 'semester' => $semester]);
    return $user;
}

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->course = Course::create(['code' => 'CSE101', 'name' => 'Programming', 'credits' => 3, 'semester' => '1.1']);
    $this->otherCourse = Course::create(['code' => 'CSE201', 'name' => 'Algorithms', 'credits' => 3, 'semester' => '2.1']);
});

test('academic resources require authentication and admin writes', function (string $resource) {
    $this->getJson('/api/'.$resource)->assertUnauthorized();
    Sanctum::actingAs(academicStudent());
    $this->postJson('/api/'.$resource, [])->assertForbidden();
    $this->putJson('/api/'.$resource.'/1', [])->assertForbidden();
    $this->deleteJson('/api/'.$resource.'/1')->assertForbidden();
})->with(['quizzes', 'assignments', 'topics', 'semesters', 'library', 'routine', 'attendance']);

test('admin can create update and delete academic items and invalid inputs are rejected', function ($resource, $extra) {
    Sanctum::actingAs($this->admin);
    $this->postJson('/api/'.$resource, [])->assertUnprocessable();
    $payload = ['course_id' => $this->course->id, 'title' => 'First item', 'description' => 'Details'] + $extra;
    $id = $this->postJson('/api/'.$resource, $payload)->assertCreated()->json('data.id');
    $this->putJson('/api/'.$resource.'/'.$id, [...$payload, 'title' => 'Updated'])->assertOk()->assertJsonPath('data.title', 'Updated');
    $this->getJson('/api/'.$resource.'?semester=1.1')->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/'.$resource.'?semester=2.1')->assertOk()->assertJsonCount(0, 'data');
    $this->deleteJson('/api/'.$resource.'/'.$id)->assertOk();
    $this->assertDatabaseMissing($resource, ['id' => $id]);
})->with([
    ['quizzes', ['date' => '2026-10-10', 'time' => '10:30', 'total_marks' => 10]],
    ['assignments', ['due_date' => '2026-10-10', 'total_marks' => 20]],
    ['topics', ['order' => 1]],
]);

test('semester data and personal completion remain isolated', function () {
    Sanctum::actingAs($this->admin);
    $payload = ['course_id' => $this->course->id, 'title' => 'Arrays', 'order' => 1];
    $topic = $this->postJson('/api/topics', $payload)->assertCreated()->json('data.id');
    $other = $this->postJson('/api/topics', [...$payload, 'course_id' => $this->otherCourse->id])->json('data.id');
    $assignment = $this->postJson('/api/assignments', ['course_id' => $this->course->id, 'title' => 'Homework', 'due_date' => '2020-01-01', 'total_marks' => 10])->json('data.id');
    $this->postJson('/api/quizzes', ['course_id' => $this->course->id, 'title' => 'Quiz', 'date' => today()->addDay()->format('Y-m-d'), 'total_marks' => 10])->assertCreated();
    $student = academicStudent();
    Sanctum::actingAs($student);
    $this->getJson('/api/topics?semester=2.1')->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $topic);
    $this->putJson('/api/topics/'.$other.'/completion', ['completed' => true])->assertNotFound();
    $this->putJson('/api/topics/'.$topic.'/completion', ['completed' => true])->assertOk();
    $this->putJson('/api/topics/'.$topic.'/completion', ['completed' => true])->assertOk();
    $this->getJson('/api/topics')->assertJsonPath('data.0.completed', true);
    $this->getJson('/api/dashboard')->assertOk()->assertJsonPath('data.stats.pending_assignments', 1)->assertJsonPath('data.stats.upcoming_quizzes', 1)->assertJsonPath('data.courses.0.progress', 100);
    $this->putJson('/api/assignments/'.$assignment.'/completion', ['completed' => true])->assertOk();
    $this->getJson('/api/dashboard')->assertJsonPath('data.stats.pending_assignments', 0);
    Sanctum::actingAs(academicStudent());
    $this->getJson('/api/topics')->assertJsonPath('data.0.completed', false);
    $this->getJson('/api/dashboard')->assertJsonPath('data.stats.pending_assignments', 1);
    Sanctum::actingAs($student);
    $this->putJson('/api/topics/'.$topic.'/completion', ['completed' => false])->assertOk();
    $this->getJson('/api/topics')->assertJsonPath('data.0.completed', false);
});

test('assignment uploads can be downloaded replaced and removed', function () {
    Storage::fake('public');
    Sanctum::actingAs($this->admin);
    $payload = ['course_id' => $this->course->id, 'title' => 'Homework', 'due_date' => '2026-10-10', 'total_marks' => 10];
    $id = $this->post('/api/assignments', [...$payload, 'file' => UploadedFile::fake()->create('task.pdf', 12, 'application/pdf')], ['Accept' => 'application/json'])->assertCreated()->json('data.id');
    $path = Assignment::find($id)->file_path;
    Storage::disk('public')->assertExists($path);
    Sanctum::actingAs(academicStudent('2.1'));
    $this->getJson('/api/assignments/'.$id.'/download')->assertNotFound();
    Sanctum::actingAs(academicStudent());
    $this->getJson('/api/assignments/'.$id.'/download')->assertDownload('task.pdf');
    Sanctum::actingAs($this->admin);
    $this->post('/api/assignments/'.$id, [...$payload, '_method' => 'PUT', 'file' => UploadedFile::fake()->create('new.pdf', 12, 'application/pdf')], ['Accept' => 'application/json'])->assertOk();
    Storage::disk('public')->assertMissing($path);
    $newPath = Assignment::find($id)->file_path;
    $this->putJson('/api/assignments/'.$id, [...$payload, 'remove_file' => true])->assertOk()->assertJsonPath('data.has_file', false);
    Storage::disk('public')->assertMissing($newPath);
});

test('routines are semester specific and preserve unassigned legacy rows', function () {
    Sanctum::actingAs($this->admin);
    $data = ['semester' => '1.1', 'course_code' => 'CSE101', 'course_name' => 'Programming', 'day' => 'Sunday', 'room' => '101', 'time' => '8:00 AM - 8:50 AM'];
    $id = $this->postJson('/api/routine', $data)->assertOk()->json('data.id');
    $this->postJson('/api/routine', [...$data, 'semester' => 'invalid'])->assertUnprocessable();
    $this->postJson('/api/routine', [...$data, 'semester' => '2.1'])->assertOk();
    Routine::create(collect($data)->except('semester')->all());
    Sanctum::actingAs(academicStudent());
    $this->getJson('/api/routine?semester=2.1')->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $id);
    $this->getJson('/api/dashboard')->assertJsonCount(1, 'data.routine');
    Sanctum::actingAs($this->admin);
    $this->getJson('/api/routine')->assertJsonCount(3, 'data');
    $this->putJson('/api/routine/'.$id, [...$data, 'room' => '202'])->assertOk();
    $this->deleteJson('/api/routine/'.$id)->assertOk();
});

test('attendance can be saved updated and deleted without duplicate rows or cross student access', function () {
    $student = academicStudent();
    Sanctum::actingAs($this->admin);
    $data = ['student_id' => $student->student->id, 'course_id' => $this->course->id, 'date' => '2026-10-03', 'status' => 'present'];
    $id = $this->postJson('/api/attendance', $data)->assertOk()->json('data.id');
    $this->postJson('/api/attendance', [...$data, 'status' => 'absent'])->assertOk();
    expect(Attendance::count())->toBe(1);
    $this->postJson('/api/attendance', [...$data, 'course_id' => $this->otherCourse->id])->assertUnprocessable();
    Sanctum::actingAs(academicStudent());
    $this->getJson('/api/attendance?student_id='.$student->student->id)->assertJsonCount(0, 'data');
    Sanctum::actingAs($student);
    $this->getJson('/api/attendance/summary')->assertJsonPath('data.absent', 1);
    Sanctum::actingAs($this->admin);
    $this->putJson('/api/attendance/'.$id, ['status' => 'present'])->assertOk();
    $this->deleteJson('/api/attendance/'.$id)->assertOk();
});

test('admin manages library inventory and semester drives safely', function () {
    Sanctum::actingAs($this->admin);
    $book = ['title' => 'Algorithms', 'author' => 'Author', 'isbn' => '1234', 'status' => 'available', 'quantity' => 2];
    $id = $this->postJson('/api/library', $book)->assertOk()->json('data.id');
    $this->postJson('/api/library', $book)->assertUnprocessable();
    $this->putJson('/api/library/'.$id, [...$book, 'quantity' => 3])->assertOk();
    $this->getJson('/api/library')->assertJsonPath('data.0.quantity', 3);
    $this->deleteJson('/api/library/'.$id)->assertOk();
    $semester = ['code' => '5.1', 'name' => 'Fifth year', 'drive_url' => 'https://drive.google.com/drive/folders/example'];
    $id = $this->postJson('/api/semesters', $semester)->assertOk()->json('data.id');
    $this->putJson('/api/semesters/'.$id, [...$semester, 'drive_url' => 'javascript:alert(1)'])->assertUnprocessable();
    $this->putJson('/api/semesters/'.$id, [...$semester, 'name' => 'Updated'])->assertOk();
    $this->putJson('/api/semesters/'.$id, [...$semester, 'code' => '5.2'])->assertUnprocessable();
    $this->deleteJson('/api/semesters/'.$id)->assertOk();
    $this->deleteJson('/api/semesters/'.Semester::where('code', '1.1')->value('id'))->assertUnprocessable();
});

test('upgrade migration preserves and backfills existing academic data', function () {
    $migration = require database_path('migrations/2026_10_03_000001_add_academic_management.php');
    $migration->down();
    $this->course->update(['topics' => ['Arrays', 'Loops']]);
    $legacy = Routine::create(['course_code' => $this->course->code, 'course_name' => $this->course->name,
        'day' => 'Sunday', 'time' => '8:00 AM - 8:50 AM', 'room' => '101']);
    $migration->up();
    expect(Routine::find($legacy->id)->semester)->toBe('1.1');
    expect(Topic::where('course_id', $this->course->id)->orderBy('order')->pluck('title')->all())->toBe(['Arrays', 'Loops']);
    expect(Course::find($this->course->id)->name)->toBe('Programming');
});
