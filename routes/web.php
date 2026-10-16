<?php

use App\Http\Controllers\ModulePageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('{module}/{page}', ModulePageController::class)
        ->whereIn('module', array_keys(ModulePageController::PAGES))
        ->name('modules.show');
});

require __DIR__.'/settings.php';
