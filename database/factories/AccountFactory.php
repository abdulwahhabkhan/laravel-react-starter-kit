<?php

namespace Database\Factories;

use App\Enums\AccountType;
use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => AccountType::Sales,
            'name' => fake()->company(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'address_line_1' => fake()->streetAddress(),
            'city' => fake()->city(),
            'region' => fake()->randomElement(['Region1', 'Region2', 'Region3']),
        ];
    }

    /**
     * Indicate that the account is a customer account.
     */
    public function customer(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => AccountType::Customer,
        ]);
    }

    /**
     * Indicate that the account is a sales account.
     */
    public function sales(): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => AccountType::Sales,
        ]);
    }
}
