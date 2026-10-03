<?php
use App\Models\User;

test('registration creates a student account and cannot grant admin access', function () {
    $this->postJson('/api/register', ['name' => 'Test Student', 'email' => 'student@example.com', 'password' => 'password123', 'student_id' => '20230001', 'role' => 'admin'])
        ->assertOk()->assertJsonPath('user.role', 'student')->assertJsonStructure(['token']);
    $user = User::where('email', 'student@example.com')->firstOrFail();
    $this->assertDatabaseHas('students', ['user_id' => $user->id, 'semester' => '1.1']);
});
test('duplicate registration is rejected without creating extra accounts', function () {
    $data = ['name' => 'Student', 'email' => 'student@example.com', 'password' => 'password123', 'student_id' => '20230001'];
    $this->postJson('/api/register', $data)->assertOk();
    $this->postJson('/api/register', $data)->assertUnprocessable();
    expect(User::count())->toBe(1);
});
