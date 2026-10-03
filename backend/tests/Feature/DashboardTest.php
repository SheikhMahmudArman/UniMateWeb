<?php
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('dashboard API requires authentication', function () {
    $this->getJson('/api/dashboard')->assertUnauthorized();
});
test('dashboard handles an account without a student profile', function () {
    Sanctum::actingAs(User::factory()->create(['role' => 'student']));
    $this->getJson('/api/dashboard')->assertOk()->assertJsonCount(0, 'data.courses')->assertJsonPath('data.stats.upcoming_quizzes', 0);
});
