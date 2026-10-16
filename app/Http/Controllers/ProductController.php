<?php

namespace App\Http\Controllers;

use App\Enums\UnitOfMeasure;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * List products, filtered by a search term and unit of measure.
     */
    public function index(Request $request): Response
    {
        $search = mb_trim($request->string('search')->toString());
        $uom = $request->enum('uom', UnitOfMeasure::class);

        $products = Product::query()
            ->when($search !== '', fn (Builder $query) => $query->where(
                fn (Builder $query) => $query
                    ->whereLike('name', "%{$search}%")
                    ->orWhereLike('sku', "%{$search}%")
                    ->orWhereLike('upc', "%{$search}%"),
            ))
            ->when($uom, fn (Builder $query) => $query->where('uom', $uom))
            ->latest('updated_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $product): array => $this->productData($product));

        return Inertia::render('catalog/products/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'uom' => $uom->value ?? '',
            ],
            'uomOptions' => $this->uomOptions(),
        ]);
    }

    /**
     * Show the form for creating a product.
     */
    public function create(): Response
    {
        return Inertia::render('catalog/products/create', [
            'uomOptions' => $this->uomOptions(),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product :name created.', ['name' => $product->name])]);

        return to_route('products.index');
    }

    /**
     * Show the form for editing a product.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('catalog/products/edit', [
            'product' => $this->productData($product),
            'uomOptions' => $this->uomOptions(),
        ]);
    }

    /**
     * Update the given product.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product :name updated.', ['name' => $product->name])]);

        return to_route('products.index');
    }

    /**
     * Delete the given product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product :name deleted.', ['name' => $product->name])]);

        return back();
    }

    /**
     * Shape a product for the frontend.
     *
     * @return array{id: int, name: string, sku: string, upc: string|null, cost: string, price: string, uom: string, uom_label: string, updated_at: string|null}
     */
    private function productData(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'upc' => $product->upc,
            'cost' => $product->cost,
            'price' => $product->price,
            'uom' => $product->uom->value,
            'uom_label' => $product->uom->label(),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Get the unit of measure choices for selects.
     *
     * @return list<array{value: string, label: string}>
     */
    private function uomOptions(): array
    {
        return array_map(
            fn (UnitOfMeasure $uom): array => ['value' => $uom->value, 'label' => $uom->label()],
            UnitOfMeasure::cases(),
        );
    }
}
