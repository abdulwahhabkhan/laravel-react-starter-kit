<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UnitOfMeasure;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 50);
        $unitPrice = fake()->randomFloat(2, 1, 500);
        $discount = round($quantity * $unitPrice * fake()->randomElement([0, 0, 0.05]), 2);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'description' => fake()->words(3, true),
            'quantity' => $quantity,
            'uom' => fake()->randomElement(UnitOfMeasure::cases()),
            'unit_price' => $unitPrice,
            'discount' => $discount,
            'tax_rate' => fake()->randomElement([0, 17]),
            'line_total' => fn (array $attributes): float => round(
                (float) $attributes['quantity'] * (float) $attributes['unit_price'] - (float) $attributes['discount'],
                2,
            ),
        ];
    }

    /**
     * Copy the description, unit of measure and price from the given product.
     */
    public function forProduct(Product $product): static
    {
        return $this->state(fn (array $attributes): array => [
            'product_id' => $product->id,
            'description' => $product->name,
            'uom' => $product->uom,
            'unit_price' => $product->price,
            'discount' => 0,
        ]);
    }

    /**
     * Copy the description, unit of measure and price from the product referenced by product_id.
     */
    public function withProductData(): static
    {
        return $this->afterMaking(function (OrderItem $orderItem): void {
            $product = Product::query()->find($orderItem->product_id);

            if ($product !== null) {
                $orderItem->description = $product->name;
                $orderItem->uom = $product->uom;
                $orderItem->unit_price = (string) $product->price;
                $orderItem->discount = '0.00';
            }
        });
    }
}
