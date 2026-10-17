<?php

use App\Providers\AppServiceProvider;
use App\Providers\EssentialsServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

/**
 * Boot the application providers again as if the app were running in the given environment.
 */
function bootProvidersIn(string $environment): void
{
    app()->detectEnvironment(fn (): string => $environment);

    new AppServiceProvider(app())->boot();
    new EssentialsServiceProvider(app())->boot();
}

test('production requires passwords of at least 12 characters', function (): void {
    bootProvidersIn('production');

    $validator = Validator::make(['password' => 'Abcdef1!xyz'], ['password' => Password::default()]);

    expect($validator->errors()->first('password'))->toBe('The password field must be at least 12 characters.');
});

test('other environments keep the default password rules', function (): void {
    bootProvidersIn('local');

    expect(Validator::make(['password' => 'abcdefgh'], ['password' => Password::default()])->passes())->toBeTrue();
});

test('production forces https urls', function (): void {
    bootProvidersIn('production');

    expect(url('/dashboard'))->toStartWith('https://');
});
