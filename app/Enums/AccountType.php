<?php

declare(strict_types=1);

namespace App\Enums;

enum AccountType: string
{
    case Sales = 'sales';

    /**
     * Get the human-readable label for the account type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Sales => 'Sales',
        };
    }
}
