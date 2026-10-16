<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Account;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $orderDate = fake()->dateTimeBetween('-3 months');
        $subtotal = fake()->randomFloat(2, 50, 5000);
        $discountTotal = round($subtotal * fake()->randomElement([0, 0, 0.05, 0.1]), 2);
        $taxTotal = round(($subtotal - $discountTotal) * 0.17, 2);

        return [
            'order_number' => fake()->unique()->numerify('SO-######'),
            'account_id' => Account::factory()->sales(),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(OrderStatus::cases()),
            'order_date' => $orderDate,
            'delivery_date' => fake()->optional()->dateTimeBetween($orderDate, '+1 month'),
            'subtotal' => $subtotal,
            'discount_total' => $discountTotal,
            'tax_total' => $taxTotal,
            'total' => round($subtotal - $discountTotal + $taxTotal, 2),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the order is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => OrderStatus::Draft,
        ]);
    }

    /**
     * Indicate that the order has been confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => OrderStatus::Confirmed,
        ]);
    }
}
