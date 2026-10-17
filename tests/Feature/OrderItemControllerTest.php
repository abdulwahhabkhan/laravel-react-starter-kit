<?php

use App\Enums\UnitOfMeasure;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

/**
 * @return array<string, mixed>
 */
function validOrderItemPayload(Product $product, array $overrides = []): array
{
    return [
        'product_id' => $product->id,
        'description' => 'Cotton Roll',
        'quantity' => '4',
        'uom' => UnitOfMeasure::Meter->value,
        'unit_price' => '250',
        'discount' => '100',
        'tax_rate' => '10',
        ...$overrides,
    ];
}

test('an item can be added and the order totals are recalculated', function (): void {
    $order = Order::factory()->draft()->create();
    $product = Product::factory()->create();

    $this->from(route('orders.edit', $order))
        ->post(route('orders.items.store', $order), validOrderItemPayload($product))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('orders.edit', $order));

    expect($order->items()->sole())
        ->product_id->toBe($product->id)
        ->line_total->toBe('900.00')
        ->and($order->refresh())
        ->subtotal->toBe('1000.00')
        ->discount_total->toBe('100.00')
        ->tax_total->toBe('90.00')
        ->total->toBe('990.00');
});

test('discount and tax default to zero', function (): void {
    $order = Order::factory()->draft()->create();

    $this->post(route('orders.items.store', $order), validOrderItemPayload(Product::factory()->create(), [
        'discount' => null,
        'tax_rate' => null,
    ]))->assertSessionHasNoErrors();

    expect($order->refresh()->total)->toBe('1000.00');
});

test('an item can be updated and the totals follow', function (): void {
    $order = Order::factory()->draft()->create();
    $item = OrderItem::factory()->for($order)->create();

    $this->put(route('orders.items.update', [$order, $item]), validOrderItemPayload($item->product, [
        'quantity' => '2',
        'discount' => '0',
        'tax_rate' => '0',
    ]))->assertSessionHasNoErrors();

    expect($item->refresh()->line_total)->toBe('500.00')
        ->and($order->refresh()->total)->toBe('500.00');
});

test('an item can be removed and the totals follow', function (): void {
    $order = Order::factory()->draft()->create();
    $kept = OrderItem::factory()->for($order)->create(['quantity' => 1, 'unit_price' => 50, 'discount' => 0, 'tax_rate' => 0]);
    $removed = OrderItem::factory()->for($order)->create();
    $order->recalculateTotals();

    $this->delete(route('orders.items.destroy', [$order, $removed]))
        ->assertSessionHasNoErrors();

    expect($order->items()->pluck('id')->all())->toBe([$kept->id])
        ->and($order->refresh()->total)->toBe('50.00');
});

test('an item from another order cannot be changed', function (): void {
    $order = Order::factory()->draft()->create();
    $otherItem = OrderItem::factory()->create();

    $this->delete(route('orders.items.destroy', [$order, $otherItem]))->assertNotFound();

    expect(OrderItem::query()->find($otherItem->id))->not->toBeNull();
});

test('lines cannot change once an order is fulfilled or cancelled', function (string $status): void {
    $order = Order::factory()->create(['status' => $status]);
    $item = OrderItem::factory()->for($order)->create();

    $this->post(route('orders.items.store', $order), validOrderItemPayload($item->product))->assertForbidden();
    $this->put(route('orders.items.update', [$order, $item]), validOrderItemPayload($item->product))->assertForbidden();
    $this->delete(route('orders.items.destroy', [$order, $item]))->assertForbidden();

    expect($order->items()->count())->toBe(1);
})->with(['fulfilled', 'cancelled']);

test('adding an item requires its fields', function (): void {
    $order = Order::factory()->draft()->create();

    $this->post(route('orders.items.store', $order), [])
        ->assertSessionHasErrors(['product_id', 'description', 'quantity', 'uom', 'unit_price']);
});

test('the quantity must be more than zero', function (): void {
    $order = Order::factory()->draft()->create();

    $this->post(route('orders.items.store', $order), validOrderItemPayload(Product::factory()->create(), ['quantity' => '0']))
        ->assertSessionHasErrors(['quantity' => 'The quantity field must be greater than 0.']);
});

test('the discount cannot exceed the line value', function (): void {
    $order = Order::factory()->draft()->create();

    $this->post(route('orders.items.store', $order), validOrderItemPayload(Product::factory()->create(), ['discount' => '1000.01']))
        ->assertSessionHasErrors(['discount' => 'The discount cannot be more than the line value.']);

    expect($order->items()->count())->toBe(0);
});
