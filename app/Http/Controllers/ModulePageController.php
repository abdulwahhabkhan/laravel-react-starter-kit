<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ModulePageController extends Controller
{
    /**
     * Placeholder module pages reachable from the sidebar, keyed by module slug.
     *
     * @var array<string, list<string>>
     */
    public const array PAGES = [
        'sales' => ['customers', 'orders', 'quotations', 'invoices', 'returns'],
        'catalog' => ['products', 'categories', 'brands', 'price-lists'],
        'inventory' => ['stock-levels', 'warehouses', 'transfers', 'adjustments'],
        'purchasing' => ['suppliers', 'purchase-orders', 'bills'],
        'reports' => ['sales-summary', 'stock-valuation', 'profit-and-loss'],
    ];

    /**
     * Module pages that have their own Inertia component instead of the generic placeholder.
     *
     * @var array<string, string>
     */
    public const array DEDICATED_PAGES = [
        'sales/customers' => 'sales/customers',
    ];

    /**
     * Render a module page with its page header and sample data.
     */
    public function __invoke(string $module, string $page): Response
    {
        abort_unless(in_array($page, self::PAGES[$module] ?? [], true), 404);

        return Inertia::render(self::DEDICATED_PAGES["{$module}/{$page}"] ?? 'modules/show', [
            'module' => $module,
            'page' => $page,
        ]);
    }
}
