<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ModulePageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('catalog')->group(function (): void {
        Route::resource('products', ProductController::class)->except('show');
    });

    Route::prefix('sales')->group(function (): void {
        Route::resource('customers', CustomerController::class)->except('show');
        Route::resource('orders', OrderController::class)->except('create');
        Route::scopeBindings()->controller(OrderItemController::class)->group(function (): void {
            Route::post('orders/{order}/items', 'store')->name('orders.items.store');
            Route::put('orders/{order}/items/{item}', 'update')->name('orders.items.update');
            Route::delete('orders/{order}/items/{item}', 'destroy')->name('orders.items.destroy');
        });
    });

    // Placeholder pages; registered last so real module routes above take precedence.
    Route::get('{module}/{page}', ModulePageController::class)
        ->whereIn('module', array_keys(ModulePageController::PAGES))
        ->name('modules.show');
});

require __DIR__.'/settings.php';
