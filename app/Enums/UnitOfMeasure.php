<?php

declare(strict_types=1);

namespace App\Enums;

enum UnitOfMeasure: string
{
    case Each = 'each';
    case Box = 'box';
    case Case = 'case';
    case Pack = 'pack';
    case Kilogram = 'kg';
    case Gram = 'g';
    case Liter = 'l';
    case Milliliter = 'ml';
    case Meter = 'm';

    /**
     * Get the human readable label for the unit of measure.
     */
    public function label(): string
    {
        return match ($this) {
            self::Each => 'Each',
            self::Box => 'Box',
            self::Case => 'Case',
            self::Pack => 'Pack',
            self::Kilogram => 'Kilogram',
            self::Gram => 'Gram',
            self::Liter => 'Liter',
            self::Milliliter => 'Milliliter',
            self::Meter => 'Meter',
        };
    }
}
