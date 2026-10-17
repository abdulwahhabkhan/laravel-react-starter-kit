<?php

use App\Models\User;

test('profile page is displayed', function (): void {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('settings redirects to the profile page', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings')
        ->assertRedirect(route('profile.edit'));
});
