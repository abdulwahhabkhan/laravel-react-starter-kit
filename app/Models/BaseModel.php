<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method string journalDetail()
 *
 * @phpstan-consistent-constructor
 */
class BaseModel extends Model
{
    /**
     * Qualify the given column with the model's table name.
     *
     * The query builder wraps the returned identifier, so it is safe in where, select, and order clauses.
     */
    final public static function qCol(string $column): string
    {
        return (new static)->qualifyColumn($column);
    }

    final public static function tName(): string
    {
        return (new static)->getTable();
    }

    final public static function morphClass(): string
    {
        return (new static)->getMorphClass();
    }

    public static function modelCacheKey(?string $suffix = null): string
    {
        return str(static::class)->replace(['/', '\\'], '.')
            ->append($suffix ? '.'.$suffix : '')
            ->lower()->toString();
    }
}
