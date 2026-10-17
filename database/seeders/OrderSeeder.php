<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * The number of orders to seed.
     */
    protected int $orderCount = 30;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = Account::query()->get();
        $products = Product::query()->get();
        $users = User::query()->get();

        if ($accounts->isEmpty() || $products->isEmpty()) {
            return;
        }

        Order::factory($this->orderCount)
            ->recycle($accounts)
            ->recycle($users)
            ->has(
                OrderItem::factory()
                    ->count(3)
                    ->recycle($products)
                    ->withProductData(),
                'items',
            )
            ->create();

        // Calculate and update order totals from items.
        Order::query()->with('items')->cursor()->each(function (Order $order): void {
            $subtotal = (float) $order->items->sum('line_total');
            $taxTotal = round($subtotal * 0.17, 2);

            $order->update([
                'subtotal' => $subtotal,
                'discount_total' => 0,
                'tax_total' => $taxTotal,
                'total' => round($subtotal + $taxTotal, 2),
            ]);
        });
    }
}
