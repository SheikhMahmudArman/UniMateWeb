<?php
use App\Models\User;
use App\Models\Student;
use Laravel\Sanctum\Sanctum;

test('profile updates stay synchronized and cannot change role or semester', function () {
    $user = User::factory()->create(['role' => 'student']);
    Student::create(['user_id' => $user->id, 'student_id' => 'S1', 'name' => $user->name, 'email' => $user->email, 'semester' => '1.1']);
    Sanctum::actingAs($user);
    $this->getJson('/api/profile')->assertOk();
    $this->putJson('/api/profile', ['name' => 'New name', 'email' => 'new@example.com', 'role' => 'admin', 'semester' => '4.2'])->assertOk();
    expect($user->fresh()->role)->toBe('student');
    $this->assertDatabaseHas('students', ['user_id' => $user->id, 'name' => 'New name', 'email' => 'new@example.com', 'semester' => '1.1']);
});
test('profile email must be unique', function () {
    $other = User::factory()->create();
    Sanctum::actingAs(User::factory()->create());
    $this->putJson('/api/profile', ['name' => 'New name', 'email' => $other->email])->assertUnprocessable();
});
