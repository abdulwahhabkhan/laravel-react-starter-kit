<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderStatus: string
{
    case Draft = 'draft';
    case Confirmed = 'confirmed';
    case Fulfilled = 'fulfilled';
    case Cancelled = 'cancelled';

    /**
     * Get the status options for select inputs.
     *
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $status): array => ['value' => $status->value, 'label' => $status->label()],
            self::cases(),
        );
    }

    /**
     * Get the human readable label for the order status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Confirmed => 'Confirmed',
            self::Fulfilled => 'Fulfilled',
            self::Cancelled => 'Cancelled',
        };
    }

    /**
     * Determine whether line items can still be added, changed or removed.
     */
    public function allowsLineChanges(): bool
    {
        return match ($this) {
            self::Draft, self::Confirmed => true,
            self::Fulfilled, self::Cancelled => false,
        };
    }
}
