<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

test('password update checks current password and revokes other tokens', function () {
    $user = User::factory()->create();
    $user->createToken('other device');
    Sanctum::actingAs($user);
    $data = ['current_password' => 'wrong', 'new_password' => 'new-password', 'new_password_confirmation' => 'new-password'];
    $this->putJson('/api/profile/change-password', $data)->assertStatus(400);
    expect(Hash::check('password', $user->fresh()->password))->toBeTrue();
    $this->putJson('/api/profile/change-password', [...$data, 'current_password' => 'password'])->assertOk();
    expect(Hash::check('new-password', $user->fresh()->password))->toBeTrue();
    expect($user->tokens()->count())->toBe(0);
});
