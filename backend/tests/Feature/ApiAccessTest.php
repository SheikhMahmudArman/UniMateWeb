<?php

test('API health endpoint is accessible', function () {
    $response = $this->getJson('/api/health');

    $response
        ->assertOk()
        ->assertJson([
            'status' => 'ok',
            'database' => 'connected',
        ]);
});

test('unauthenticated user cannot access protected API routes', function () {
    $this->getJson('/api/user')
        ->assertUnauthorized();

    $this->getJson('/api/dashboard')
        ->assertUnauthorized();
});