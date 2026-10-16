<?php

use App\Http\Controllers\ModulePageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('catalog')->group(function (): void {
        Route::resource('products', ProductController::class)->except('show');
    });

    // Placeholder pages; registered last so real module routes above take precedence.
    Route::get('{module}/{page}', ModulePageController::class)
        ->whereIn('module', array_keys(ModulePageController::PAGES))
        ->name('modules.show');
});

require __DIR__.'/settings.php';
