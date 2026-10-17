<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $order_number
 * @property int $account_id
 * @property int|null $user_id
 * @property OrderStatus $status
 * @property Carbon $order_date
 * @property Carbon|null $delivery_date
 * @property string $subtotal
 * @property string $discount_total
 * @property string $tax_total
 * @property string $total
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Account $account
 * @property-read User|null $user
 * @property-read Collection<int, OrderItem> $items
 */
#[Fillable([
    'order_number', 'account_id', 'user_id', 'status', 'order_date', 'delivery_date',
    'subtotal', 'discount_total', 'tax_total', 'total', 'notes',
])]
class Order extends BaseModel
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * Get the customer account the order was placed by.
     *
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the user who created the order.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the line items on the order.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Recalculate and persist the order totals from its line items.
     *
     * Subtotal is the gross value before discounts; tax is charged on each discounted line.
     */
    public function recalculateTotals(): void
    {
        $items = $this->items()->get(['quantity', 'unit_price', 'discount', 'tax_rate', 'line_total']);

        $subtotal = $items->sum(fn (OrderItem $item): float => (float) $item->quantity * (float) $item->unit_price);
        $discountTotal = $items->sum(fn (OrderItem $item): float => (float) $item->discount);
        $taxTotal = $items->sum(fn (OrderItem $item): float => (float) $item->line_total * (float) $item->tax_rate / 100);

        $this->update([
            'subtotal' => round($subtotal, 2),
            'discount_total' => round($discountTotal, 2),
            'tax_total' => round($taxTotal, 2),
            'total' => round($subtotal - $discountTotal + $taxTotal, 2),
        ]);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'order_date' => 'date',
            'delivery_date' => 'date',
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }
}
