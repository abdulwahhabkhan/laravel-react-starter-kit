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

        foreach (range(1, 30) as $ignored) {
            $order = Order::factory()->create([
                'account_id' => $accounts->random()->id,
                'user_id' => $users->isEmpty() ? null : $users->random()->id,
            ]);

            foreach ($products->random(min(fake()->numberBetween(1, 5), $products->count())) as $product) {
                OrderItem::factory()->for($order)->forProduct($product)->create();
            }

            $subtotal = (float) $order->items()->sum('line_total');
            $taxTotal = round($subtotal * 0.17, 2);

            $order->update([
                'subtotal' => $subtotal,
                'discount_total' => 0,
                'tax_total' => $taxTotal,
                'total' => round($subtotal + $taxTotal, 2),
            ]);
        }
    }
}
