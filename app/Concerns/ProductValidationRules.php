<?php

namespace App\Concerns;

use App\Enums\UnitOfMeasure;
use App\Models\Product;
use Illuminate\Validation\Rule;
use Stringable;

trait ProductValidationRules
{
    /**
     * Get the field names used in product validation messages.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'sku' => 'SKU',
            'upc' => 'UPC',
            'price' => 'sale price',
            'uom' => 'unit of measure',
        ];
    }

    /**
     * Get the validation rules used to create or update a product.
     *
     * @return array<string, array<int, Stringable|string>>
     */
    protected function productRules(?Product $product = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:64', Rule::unique(Product::class)->ignore($product)],
            'upc' => ['nullable', 'string', 'max:64', Rule::unique(Product::class)->ignore($product)],
            'cost' => $this->moneyRules(),
            'price' => $this->moneyRules(),
            'uom' => ['required', Rule::enum(UnitOfMeasure::class)],
        ];
    }

    /**
     * Get the validation rules for an amount stored as decimal(12, 2).
     *
     * @return array<int, string>
     */
    protected function moneyRules(): array
    {
        return ['required', 'numeric', 'decimal:0,2', 'min:0', 'max:9999999999.99'];
    }
}
