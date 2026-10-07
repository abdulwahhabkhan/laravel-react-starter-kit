<?php

declare(strict_types=1);

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case User = 'user';

    /**
     * Get the human readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::User => 'User',
        };
    }

    /**
     * Get the email address of the seeded demo user for the role.
     */
    public function demoEmail(): string
    {
        return "{$this->value}@example.com";
    }
}
