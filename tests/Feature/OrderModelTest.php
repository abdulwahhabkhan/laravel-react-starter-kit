<?php

declare(strict_types=1);

use App\Enums\OrderStatus;
use App\Enums\UnitOfMeasure;
use App\Models\Account;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Database\Seeders\OrderSeeder;
use Illuminate\Database\QueryException;

use function Pest\Laravel\seed;

test('order belongs to an account and has many items', function (): void {
    $order = Order::factory()->confirmed()->create();
    OrderItem::factory()->count(2)->for($order)->create();

    $order->refresh();

    expect($order->status)->toBe(OrderStatus::Confirmed)
        ->and($order->account->orders->modelKeys())->toBe([$order->id])
        ->and($order->items)->toHaveCount(2);
});

test('order item copies details from its product', function (): void {
    $product = Product::factory()->create(['name' => 'Cotton Roll', 'price' => 12.5, 'uom' => UnitOfMeasure::Meter]);

    $item = OrderItem::factory()->forProduct($product)->create(['quantity' => 4]);

    expect($item->refresh())
        ->description->toBe('Cotton Roll')
        ->uom->toBe(UnitOfMeasure::Meter)
        ->unit_price->toBe('12.50')
        ->line_total->toBe('50.00')
        ->and($product->orderItems->modelKeys())->toBe([$item->id]);
});

test('deleting an order deletes its items', function (): void {
    $item = OrderItem::factory()->create();

    $item->order->delete();

    expect(OrderItem::query()->find($item->id))->toBeNull();
});

test('a product on an order cannot be deleted', function (): void {
    $item = OrderItem::factory()->create();

    $item->product->delete();
})->throws(QueryException::class);

test('order seeder creates orders whose totals match their items', function (): void {
    Account::factory()->count(2)->create();
    Product::factory()->count(5)->create();

    seed(OrderSeeder::class);

    $order = Order::query()->with('items')->firstOrFail();
    $subtotal = round((float) $order->items->sum('line_total'), 2);

    expect(Order::query()->count())->toBe(30)
        ->and($order->items)->not->toBeEmpty()
        ->and((float) $order->subtotal)->toBe($subtotal)
        ->and((float) $order->total)->toBe(round($subtotal * 1.17, 2));
});
