<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderItemRequest;
use App\Http\Requests\UpdateOrderItemRequest;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderItemController extends Controller
{
    /**
     * Add a line item to the order.
     */
    public function store(StoreOrderItemRequest $request, Order $order): RedirectResponse
    {
        DB::transaction(function () use ($request, $order): void {
            $order->items()->create($this->lineData($request->validated()));
            $order->recalculateTotals();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Item added to :number.', ['number' => $order->order_number])]);

        return back();
    }

    /**
     * Update a line item on the order.
     */
    public function update(UpdateOrderItemRequest $request, Order $order, OrderItem $item): RedirectResponse
    {
        DB::transaction(function () use ($request, $order, $item): void {
            $item->update($this->lineData($request->validated()));
            $order->recalculateTotals();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Item updated.')]);

        return back();
    }

    /**
     * Remove a line item from the order.
     */
    public function destroy(Order $order, OrderItem $item): RedirectResponse
    {
        abort_unless($order->status->allowsLineChanges(), 403);

        DB::transaction(function () use ($order, $item): void {
            $item->delete();
            $order->recalculateTotals();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Item removed.')]);

        return back();
    }

    /**
     * Fill defaults and compute the line total (quantity × price − discount, before tax).
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function lineData(array $validated): array
    {
        $discount = (float) ($validated['discount'] ?? 0);

        return [
            ...$validated,
            'discount' => $discount,
            'tax_rate' => (float) ($validated['tax_rate'] ?? 0),
            'line_total' => round((float) $validated['quantity'] * (float) $validated['unit_price'] - $discount, 2),
        ];
    }
}
