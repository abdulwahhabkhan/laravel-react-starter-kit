<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UnitOfMeasure;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cost = fake()->randomFloat(2, 1, 500);

        return [
            'name' => fake()->words(3, true),
            'sku' => fake()->unique()->bothify('SKU-####-????'),
            'upc' => fake()->unique()->ean13(),
            'cost' => $cost,
            'price' => round($cost * fake()->randomFloat(2, 1.1, 2), 2),
            'uom' => fake()->randomElement(UnitOfMeasure::cases()),
        ];
    }
}
