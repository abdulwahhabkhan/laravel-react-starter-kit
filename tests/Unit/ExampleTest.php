<?php

declare(strict_types=1);

use App\Enums\Role;

test('each role has a label and demo email', function (Role $role): void {
    expect($role->label())->toBe(ucfirst($role->value))
        ->and($role->demoEmail())->toBe("{$role->value}@example.com");
})->with(Role::cases());
