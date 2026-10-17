<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\UnitOfMeasure;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Account;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * List orders with search, customer, date and status filters.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => mb_trim($request->string('search')->toString()),
            'status' => OrderStatus::tryFrom($request->string('status')->toString())?->value ?? '',
            'customer' => $request->integer('customer') ?: '',
            'from' => $this->dateFilter($request, 'from'),
            'to' => $this->dateFilter($request, 'to'),
        ];

        $orders = $this->filteredOrders($filters)
            ->when($filters['status'] !== '', fn (Builder $query) => $query->where('status', $filters['status']))
            ->with('account:id,name,city')
            ->latest('order_date')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order): array => $this->orderListData($order));

        /** @var array<string, int> $statusCounts */
        $statusCounts = $this->filteredOrders($filters)
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->all();

        return Inertia::render('sales/orders/index', [
            'orders' => $orders,
            'filters' => $filters,
            'statusCounts' => $statusCounts,
            'statusOptions' => OrderStatus::options(),
            'customerOptions' => $this->customerOptions(),
        ]);
    }

    /**
     * Start a draft order for the chosen customer and continue on the edit page.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $order = DB::transaction(function () use ($request): Order {
            $order = Order::create([
                'order_number' => 'SO-PENDING-'.str()->uuid(),
                'account_id' => $request->integer('account_id'),
                'user_id' => $request->user()?->id,
                'status' => OrderStatus::Draft,
                'order_date' => today(),
            ]);

            $order->update(['order_number' => sprintf('SO-%s-%04d', today()->format('ymd'), $order->id)]);

            return $order;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order :number created. Add the items below.', ['number' => $order->order_number])]);

        return to_route('orders.edit', $order);
    }

    /**
     * Show a read-only, printable preview of the order.
     */
    public function show(Order $order): Response
    {
        $order->load(['account', 'items.product:id,sku', 'user:id,name']);

        return Inertia::render('sales/orders/show', [
            'order' => $this->orderData($order),
        ]);
    }

    /**
     * Show the order editor with its details and line items.
     */
    public function edit(Order $order): Response
    {
        $order->load(['account', 'items.product:id,sku', 'user:id,name']);

        return Inertia::render('sales/orders/edit', [
            'order' => $this->orderData($order),
            'customerOptions' => $this->customerOptions($order->account),
            'statusOptions' => OrderStatus::options(),
            'uomOptions' => array_map(
                fn (UnitOfMeasure $uom): array => ['value' => $uom->value, 'label' => $uom->label()],
                UnitOfMeasure::cases(),
            ),
            // Loaded only when the item drawer opens.
            'productOptions' => Inertia::optional(fn () => Product::query()
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'price', 'uom'])
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'uom' => $product->uom->value,
                ])),
        ]);
    }

    /**
     * Update the order details.
     */
    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $order->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order :number saved.', ['number' => $order->order_number])]);

        return back();
    }

    /**
     * Delete the order and its line items.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $number = $order->order_number;

        $order->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order :number deleted.', ['number' => $number])]);

        // Return to the filtered list it was deleted from; the order's own pages no longer exist.
        $deletedPages = [route('orders.edit', $order), route('orders.show', $order)];

        return in_array(url()->previous(), $deletedPages, true) ? to_route('orders.index') : back();
    }

    /**
     * Orders matching every filter except status, so status tabs can show their counts.
     *
     * @param  array{search: string, status: string, customer: int|string, from: string, to: string}  $filters
     * @return Builder<Order>
     */
    private function filteredOrders(array $filters): Builder
    {
        return Order::query()
            ->when($filters['search'] !== '', fn (Builder $query) => $query->where(
                fn (Builder $query) => $query
                    ->whereLike('order_number', "%{$filters['search']}%")
                    ->orWhereHas('account', fn (Builder $query) => $query->whereLike('name', "%{$filters['search']}%")),
            ))
            ->when($filters['customer'] !== '', fn (Builder $query) => $query->where('account_id', $filters['customer']))
            ->when($filters['from'] !== '', fn (Builder $query) => $query->whereDate('order_date', '>=', $filters['from']))
            ->when($filters['to'] !== '', fn (Builder $query) => $query->whereDate('order_date', '<=', $filters['to']));
    }

    /**
     * Read a Y-m-d date filter, ignoring anything that is not a valid date.
     */
    private function dateFilter(Request $request, string $key): string
    {
        $value = $request->string($key)->toString();

        return Carbon::canBeCreatedFromFormat($value, 'Y-m-d') ? $value : '';
    }

    /**
     * Customers for filters and pickers, plus the given account so an order's current account stays selectable.
     *
     * @return list<array{id: int, name: string, city: string|null}>
     */
    private function customerOptions(?Account $include = null): array
    {
        return Account::customer()
            ->orderBy('name')
            ->get(['id', 'name', 'city'])
            ->when($include, fn ($accounts) => $accounts->push($include)->unique('id')->sortBy('name'))
            ->map(fn (Account $account): array => [
                'id' => $account->id,
                'name' => $account->name,
                'city' => $account->city,
            ])
            ->values()
            ->all();
    }

    /**
     * Shape an order for the list table.
     *
     * @return array{id: int, order_number: string, status: string, status_label: string, order_date: string, delivery_date: string|null, customer: array{id: int, name: string, city: string|null}, total: string}
     */
    private function orderListData(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'order_date' => $order->order_date->toDateString(),
            'delivery_date' => $order->delivery_date?->toDateString(),
            'customer' => [
                'id' => $order->account->id,
                'name' => $order->account->name,
                'city' => $order->account->city,
            ],
            'total' => $order->total,
        ];
    }

    /**
     * Shape an order with its customer and line items for the editor and preview.
     *
     * @return array<string, mixed>
     */
    private function orderData(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'allows_line_changes' => $order->status->allowsLineChanges(),
            'order_date' => $order->order_date->toDateString(),
            'delivery_date' => $order->delivery_date?->toDateString(),
            'notes' => $order->notes,
            'subtotal' => $order->subtotal,
            'discount_total' => $order->discount_total,
            'tax_total' => $order->tax_total,
            'total' => $order->total,
            'created_by' => $order->user?->name,
            'updated_at' => $order->updated_at?->toIso8601String(),
            'customer' => [
                'id' => $order->account->id,
                'name' => $order->account->name,
                'phone' => $order->account->phone,
                'email' => $order->account->email,
                'address_line_1' => $order->account->address_line_1,
                'city' => $order->account->city,
                'region' => $order->account->region,
            ],
            'items' => $order->items->map(fn (OrderItem $item): array => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'sku' => $item->product->sku,
                'description' => $item->description,
                'quantity' => $item->quantity,
                'uom' => $item->uom->value,
                'uom_label' => $item->uom->label(),
                'unit_price' => $item->unit_price,
                'discount' => $item->discount,
                'tax_rate' => $item->tax_rate,
                'line_total' => $item->line_total,
            ])->values()->all(),
        ];
    }
}
