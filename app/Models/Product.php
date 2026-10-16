<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UnitOfMeasure;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $sku
 * @property string|null $upc
 * @property string $cost
 * @property string $price
 * @property UnitOfMeasure $uom
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, OrderItem> $orderItems
 */
#[Fillable(['name', 'sku', 'upc', 'cost', 'price', 'uom'])]
class Product extends BaseModel
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * Get the sales order lines the product appears on.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cost' => 'decimal:2',
            'price' => 'decimal:2',
            'uom' => UnitOfMeasure::class,
        ];
    }
}
