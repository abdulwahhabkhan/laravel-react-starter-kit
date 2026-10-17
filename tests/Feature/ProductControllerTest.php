<?php

use App\Enums\UnitOfMeasure;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validProductPayload(array $overrides = []): array
{
    return [
        'name' => 'Premium Lawn 60s',
        'sku' => 'CTN-LWN-060',
        'upc' => '8961000000014',
        'cost' => '250.50',
        'price' => '300',
        'uom' => UnitOfMeasure::Meter->value,
        ...$overrides,
    ];
}

test('guests are redirected to the login page', function (): void {
    auth()->logout();

    $this->get(route('products.index'))->assertRedirect(route('login'));
});

test('products are listed newest first', function (): void {
    $older = Product::factory()->create(['updated_at' => now()->subDay()]);
    $newer = Product::factory()->create(['updated_at' => now()]);

    $this->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('catalog/products/index')
            ->has('products.data', 2)
            ->where('products.data.0.id', $newer->id)
            ->where('products.data.1.id', $older->id)
            ->where('products.data.0.uom_label', $newer->uom->label())
            ->has('uomOptions', count(UnitOfMeasure::cases())));
});

test('products can be searched by name, sku or upc', function (string $search): void {
    $match = Product::factory()->create(['name' => 'Irish Linen White', 'sku' => 'LIN-IRS-WHT', 'upc' => '8961000000021']);
    Product::factory()->create(['name' => 'Raw Silk Ivory', 'sku' => 'SLK-RAW-IVY', 'upc' => '8961000000038']);

    $this->get(route('products.index', ['search' => $search]))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
            ->where('filters.search', $search));
})->with([
    'name' => 'linen',
    'sku' => 'LIN-IRS',
    'upc' => '0000021',
]);

test('products can be filtered by unit of measure', function (): void {
    $meter = Product::factory()->create(['uom' => UnitOfMeasure::Meter]);
    Product::factory()->create(['uom' => UnitOfMeasure::Box]);

    $this->get(route('products.index', ['uom' => UnitOfMeasure::Meter->value]))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $meter->id)
            ->where('filters.uom', UnitOfMeasure::Meter->value));
});

test('an unknown unit of measure filter is ignored', function (): void {
    Product::factory()->count(2)->create();

    $this->get(route('products.index', ['uom' => 'parsec']))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->has('products.data', 2)
            ->where('filters.uom', ''));
});

test('the create page is displayed', function (): void {
    $this->get(route('products.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('catalog/products/create')
            ->has('uomOptions'));
});

test('a product can be created', function (): void {
    $this->post(route('products.store'), validProductPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('products.index'));

    $product = Product::query()->sole();

    expect($product->name)->toBe('Premium Lawn 60s')
        ->and($product->sku)->toBe('CTN-LWN-060')
        ->and($product->upc)->toBe('8961000000014')
        ->and($product->cost)->toBe('250.50')
        ->and($product->price)->toBe('300.00')
        ->and($product->uom)->toBe(UnitOfMeasure::Meter);
});

test('a product can be created without a upc', function (): void {
    $this->post(route('products.store'), validProductPayload(['upc' => null]))
        ->assertSessionHasNoErrors();

    expect(Product::query()->sole()->upc)->toBeNull();
});

test('creating a product requires its fields', function (): void {
    $this->post(route('products.store'), [])
        ->assertSessionHasErrors(['name', 'sku', 'cost', 'price', 'uom'])
        ->assertSessionDoesntHaveErrors('upc');

    expect(Product::query()->count())->toBe(0);
});

test('sku and upc must be unique', function (string $field, string $label): void {
    Product::factory()->create(validProductPayload());

    $this->post(route('products.store'), validProductPayload([
        'sku' => $field === 'sku' ? 'CTN-LWN-060' : 'NEW-SKU-001',
        'upc' => $field === 'upc' ? '8961000000014' : '8961000000099',
    ]))->assertSessionHasErrors([$field => "The {$label} has already been taken."]);
})->with([
    'sku' => ['sku', 'SKU'],
    'upc' => ['upc', 'UPC'],
]);

test('amounts are validated', function (string $field, mixed $value, string $message): void {
    $this->post(route('products.store'), validProductPayload([$field => $value]))
        ->assertSessionHasErrors([$field => $message]);
})->with([
    'negative cost' => ['cost', '-1', 'The cost field must be at least 0.'],
    'too many decimals' => ['price', '10.555', 'The sale price field must have 0-2 decimal places.'],
    'not a number' => ['price', 'free', 'The sale price field must be a number.'],
]);

test('the unit of measure must be a known unit', function (): void {
    $this->post(route('products.store'), validProductPayload(['uom' => 'parsec']))
        ->assertSessionHasErrors(['uom' => 'The selected unit of measure is invalid.']);
});

test('the edit page is displayed', function (): void {
    $product = Product::factory()->create();

    $this->get(route('products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('catalog/products/edit')
            ->where('product.id', $product->id)
            ->where('product.sku', $product->sku)
            ->has('uomOptions'));
});

test('a product can be updated and keep its own sku and upc', function (): void {
    $product = Product::factory()->create(validProductPayload());

    $this->put(route('products.update', $product), validProductPayload(['name' => 'Premium Lawn 80s', 'price' => '320']))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('products.index'));

    $product->refresh();

    expect($product->name)->toBe('Premium Lawn 80s')
        ->and($product->price)->toBe('320.00')
        ->and($product->sku)->toBe('CTN-LWN-060');
});

test("a product cannot take another product's sku", function (): void {
    Product::factory()->create(['sku' => 'TAKEN-001']);
    $product = Product::factory()->create();

    $this->put(route('products.update', $product), validProductPayload(['sku' => 'TAKEN-001', 'upc' => null]))
        ->assertSessionHasErrors(['sku' => 'The SKU has already been taken.']);
});

test('a product can be deleted', function (): void {
    $product = Product::factory()->create();

    $this->from(route('products.index'))
        ->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index'));

    $this->assertModelMissing($product);
});
