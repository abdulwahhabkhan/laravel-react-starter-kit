<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UnitOfMeasure;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property string $description
 * @property string $quantity
 * @property UnitOfMeasure $uom
 * @property string $unit_price
 * @property string $discount
 * @property string $tax_rate
 * @property string $line_total
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Order $order
 * @property-read Product $product
 */
#[Fillable([
    'order_id', 'product_id', 'description', 'quantity', 'uom',
    'unit_price', 'discount', 'tax_rate', 'line_total',
])]
class OrderItem extends BaseModel
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    /**
     * Get the order the item belongs to.
     *
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product being sold.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:3',
            'uom' => UnitOfMeasure::class,
            'unit_price' => 'decimal:2',
            'discount' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }
}
