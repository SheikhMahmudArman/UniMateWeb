<?php
use App\Models\User;

test('API login issues a token for valid credentials', function () {
    $user = User::factory()->create();
    $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password']);
    $response->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'role']]);
    expect($user->tokens()->count())->toBe(1);
});
test('API login rejects an invalid password', function () {
    $user = User::factory()->create();
    $this->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong-password'])->assertUnprocessable();
    expect($user->tokens()->count())->toBe(0);
});
test('API logout revokes the current token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;
    $this->withToken($token)->postJson('/api/logout')->assertOk();
    expect($user->tokens()->count())->toBe(0);
});
