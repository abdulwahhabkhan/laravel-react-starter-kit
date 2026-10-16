<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function (): void {
    $this->get(route('modules.show', ['sales', 'customers']))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit a module page', function (): void {
    $this->actingAs(User::factory()->create());

    $this->get(route('modules.show', ['catalog', 'products']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('modules/show')
            ->where('module', 'catalog')
            ->where('page', 'products'));
});

test('unknown module pages return not found', function (string $module, string $page): void {
    $this->actingAs(User::factory()->create());

    $this->get("/{$module}/{$page}")->assertNotFound();
})->with([
    'unknown page' => ['sales', 'unknown'],
    'page from another module' => ['sales', 'products'],
    'unknown module' => ['unknown', 'customers'],
]);
