<?php

use App\Enums\OrderStatus;
use App\Models\Account;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

test('guests are redirected to the login page', function (): void {
    auth()->logout();

    $this->get(route('orders.index'))->assertRedirect(route('login'));
});

test('orders are listed newest first with their customer', function (): void {
    $older = Order::factory()->create(['order_date' => now()->subDays(3)]);
    $newer = Order::factory()->create(['order_date' => now()]);

    $this->get(route('orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('sales/orders/index')
            ->has('orders.data', 2)
            ->where('orders.data.0.id', $newer->id)
            ->where('orders.data.0.customer.name', $newer->account->name)
            ->where('orders.data.1.id', $older->id));
});

test('orders can be searched by order number or customer name', function (string $search): void {
    $customer = Account::factory()->customer()->create(['name' => 'Lotus Textiles']);
    $match = Order::factory()->for($customer)->create(['order_number' => 'SO-261017-0042']);
    Order::factory()->create(['order_number' => 'SO-261017-0099']);

    $this->get(route('orders.index', ['search' => $search]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $match->id));
})->with([
    'order number' => '0042',
    'customer name' => 'lotus',
]);

test('orders can be filtered by status, customer and order date range', function (): void {
    $customer = Account::factory()->customer()->create();
    $match = Order::factory()->for($customer)->confirmed()->create(['order_date' => '2026-10-10']);
    Order::factory()->for($customer)->draft()->create(['order_date' => '2026-10-10']);
    Order::factory()->for($customer)->confirmed()->create(['order_date' => '2026-09-01']);
    Order::factory()->confirmed()->create(['order_date' => '2026-10-10']);

    $this->get(route('orders.index', [
        'status' => 'confirmed',
        'customer' => $customer->id,
        'from' => '2026-10-01',
        'to' => '2026-10-31',
    ]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $match->id)
            ->where('filters.status', 'confirmed'));
});

test('status counts ignore the selected status but respect other filters', function (): void {
    $customer = Account::factory()->customer()->create();
    Order::factory()->for($customer)->draft()->count(2)->create();
    Order::factory()->for($customer)->confirmed()->create();
    Order::factory()->draft()->create();

    $this->get(route('orders.index', ['status' => 'confirmed', 'customer' => $customer->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('statusCounts.draft', 2)
            ->where('statusCounts.confirmed', 1));
});

test('invalid status and date filters are ignored', function (): void {
    Order::factory()->count(2)->create();

    $this->get(route('orders.index', ['status' => 'shipped', 'from' => 'yesterday']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 2)
            ->where('filters.status', '')
            ->where('filters.from', ''));
});

test('creating an order starts a draft for the customer and opens the editor', function (): void {
    $customer = Account::factory()->customer()->create();

    $response = $this->post(route('orders.store'), ['account_id' => $customer->id]);

    $order = Order::query()->sole();

    $response->assertRedirect(route('orders.edit', $order));

    expect($order)
        ->account_id->toBe($customer->id)
        ->user_id->toBe(auth()->id())
        ->status->toBe(OrderStatus::Draft)
        ->order_number->toBe(sprintf('SO-%s-%04d', today()->format('ymd'), $order->id))
        ->and($order->order_date->isToday())->toBeTrue();
});

test('an order can only be created for a customer account', function (): void {
    $salesAccount = Account::factory()->sales()->create();

    $this->post(route('orders.store'), ['account_id' => $salesAccount->id])
        ->assertSessionHasErrors(['account_id' => 'The selected customer is invalid.']);

    expect(Order::query()->count())->toBe(0);
});

test('the edit page shows the order with its items and loads products on demand', function (): void {
    $order = Order::factory()->draft()->has(OrderItem::factory(), 'items')->create();

    $this->get(route('orders.edit', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('sales/orders/edit')
            ->where('order.id', $order->id)
            ->where('order.allows_line_changes', true)
            ->has('order.items', 1)
            ->missing('productOptions')
            ->reloadOnly('productOptions', fn (Assert $reload) => $reload->has('productOptions', 1)));
});

test('the preview page shows the order', function (): void {
    $order = Order::factory()->create();

    $this->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('sales/orders/show')
            ->where('order.order_number', $order->order_number)
            ->where('order.customer.name', $order->account->name));
});

test('order details can be updated', function (): void {
    $order = Order::factory()->draft()->create();
    $customer = Account::factory()->customer()->create();

    $this->from(route('orders.edit', $order))
        ->put(route('orders.update', $order), [
            'account_id' => $customer->id,
            'status' => 'confirmed',
            'order_date' => '2026-10-17',
            'delivery_date' => '2026-10-20',
            'notes' => 'Deliver before noon.',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('orders.edit', $order));

    expect($order->refresh())
        ->account_id->toBe($customer->id)
        ->status->toBe(OrderStatus::Confirmed)
        ->delivery_date->toDateString()->toBe('2026-10-20')
        ->notes->toBe('Deliver before noon.');
});

test('the delivery date cannot be before the order date', function (): void {
    $order = Order::factory()->create();

    $this->put(route('orders.update', $order), [
        'account_id' => Account::factory()->customer()->create()->id,
        'status' => 'draft',
        'order_date' => '2026-10-17',
        'delivery_date' => '2026-10-16',
    ])->assertSessionHasErrors(['delivery_date' => 'The delivery date field must be a date after or equal to order date.']);
});

test('updating an order requires its fields', function (): void {
    $order = Order::factory()->create();

    $this->put(route('orders.update', $order), [])
        ->assertSessionHasErrors(['account_id', 'status', 'order_date']);
});

test('an order can be deleted with its items', function (): void {
    $order = Order::factory()->has(OrderItem::factory(), 'items')->create();
    $filteredList = route('orders.index', ['status' => 'draft']);

    $this->from($filteredList)
        ->delete(route('orders.destroy', $order))
        ->assertRedirect($filteredList);

    expect(Order::query()->count())->toBe(0)
        ->and(OrderItem::query()->count())->toBe(0);
});

test('deleting an order from its edit page returns to the order list', function (): void {
    $order = Order::factory()->create();

    $this->from(route('orders.edit', $order))
        ->delete(route('orders.destroy', $order))
        ->assertRedirect(route('orders.index'));
});

test('an order can keep its current non-customer account when saving details', function (): void {
    $order = Order::factory()->for(Account::factory()->sales())->draft()->create();

    $this->get(route('orders.edit', $order))
        ->assertInertia(fn (Assert $page) => $page
            ->where('customerOptions', fn ($options) => collect($options)->contains('id', $order->account_id)));

    $this->put(route('orders.update', $order), [
        'account_id' => $order->account_id,
        'status' => 'confirmed',
        'order_date' => '2026-10-17',
    ])->assertSessionHasNoErrors();

    expect($order->refresh()->status)->toBe(OrderStatus::Confirmed);
});
