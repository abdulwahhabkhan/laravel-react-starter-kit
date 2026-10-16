<?php

use App\Enums\AccountType;
use App\Enums\UnitOfMeasure;
use App\Models\Account;
use App\Models\Product;

test('product casts unit of measure to enum and money to two decimals', function (): void {
    $product = Product::factory()->create(['cost' => 10, 'price' => 15.5, 'uom' => UnitOfMeasure::Box]);

    $product->refresh();

    expect($product->uom)->toBe(UnitOfMeasure::Box)
        ->and($product->cost)->toBe('10.00')
        ->and($product->price)->toBe('15.50');
});

test('account defaults to sales type', function (): void {
    $account = Account::query()->create(['name' => 'Acme Ltd']);

    expect($account->refresh()->type)->toBe(AccountType::Sales);
});
