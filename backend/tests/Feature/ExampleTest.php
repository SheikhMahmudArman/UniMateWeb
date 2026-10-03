<?php

test('unknown API routes return not found instead of the SPA', function () {
    $this->getJson('/api/not-a-real-endpoint')->assertNotFound();
});
