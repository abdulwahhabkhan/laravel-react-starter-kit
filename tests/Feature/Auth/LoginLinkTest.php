<?php

use App\Enums\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('login screen exposes a login link for each role in allowed environments', function (): void {
    config(['login-link.allowed_environments' => ['testing']]);

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('auth/login')
            ->has('loginLinks', count(Role::cases()))
            ->where('loginLinks.0.role', Role::Admin->value)
            ->where('loginLinks.0.email', Role::Admin->demoEmail())
            ->where('loginLinks.1.role', Role::User->value)
        );
});

test('login screen hides login links outside allowed environments', function (): void {
    config(['login-link.allowed_environments' => ['local']]);

    $this->get(route('login'))
        ->assertInertia(fn (Assert $page): Assert => $page->has('loginLinks', 0));
});

test('login link logs in the user for the given role', function (Role $role): void {
    config(['login-link.allowed_environments' => ['testing']]);

    $user = User::factory()->create(['email' => $role->demoEmail(), 'role' => $role]);

    $this->post('http://localhost'.route('loginLinkLogin', absolute: false), [
        'email' => $role->demoEmail(),
        'user_attributes' => json_encode(['role' => $role->value]),
        'redirect_url' => route('dashboard', absolute: false),
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);
    expect(auth()->user()->role)->toBe($role);
})->with(Role::cases());

test('login link is rejected outside allowed environments', function (): void {
    config(['login-link.allowed_environments' => ['local']]);

    User::factory()->admin()->create(['email' => Role::Admin->demoEmail()]);

    $this->post('http://localhost'.route('loginLinkLogin', absolute: false), [
        'email' => Role::Admin->demoEmail(),
    ])->assertServerError();

    $this->assertGuest();
});

test('database seeder creates a user for each role', function (): void {
    $this->seed();

    foreach (Role::cases() as $role) {
        expect(User::query()->where('email', $role->demoEmail())->first()?->role)->toBe($role);
    }
});
