<?php

use App\Enums\AccountType;
use App\Models\Account;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validCustomerPayload(array $overrides = []): array
{
    return [
        'name' => 'Al-Noor Textiles',
        'phone' => '+92 300 1234567',
        'email' => 'orders@alnoor.test',
        'address_line_1' => '12 Mall Road',
        'city' => 'Lahore',
        'region' => 'Punjab',
        ...$overrides,
    ];
}

test('guests are redirected to the login page', function (): void {
    auth()->logout();

    $this->get(route('customers.index'))->assertRedirect(route('login'));
});

test('only customer accounts are listed, newest first', function (): void {
    $older = Account::factory()->customer()->create(['updated_at' => now()->subDay()]);
    $newer = Account::factory()->customer()->create(['updated_at' => now()]);
    Account::factory()->sales()->create();

    $this->get(route('customers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('sales/customers/index')
            ->has('customers.data', 2)
            ->where('customers.data.0.id', $newer->id)
            ->where('customers.data.1.id', $older->id)
            ->where('customers.data.0.updated_at', $newer->updated_at?->toIso8601String()));
});

test('customers can be searched by name, phone or email', function (string $search): void {
    $match = Account::factory()->customer()->create(['name' => 'Gul Ahmed Fabrics', 'phone' => '0423-5550101', 'email' => 'sales@gulahmed.test']);
    Account::factory()->customer()->create(['name' => 'Khaadi Stores', 'phone' => '0213-5550202', 'email' => 'buying@khaadi.test']);

    $this->get(route('customers.index', ['search' => $search]))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->has('customers.data', 1)
            ->where('customers.data.0.id', $match->id)
            ->where('filters.search', $search));
})->with([
    'name' => 'gul ahmed',
    'phone' => '5550101',
    'email' => 'gulahmed.test',
]);

test('customers can be filtered by city and region', function (): void {
    $match = Account::factory()->customer()->create(['city' => 'Lahore', 'region' => 'Punjab']);
    Account::factory()->customer()->create(['city' => 'Lahore', 'region' => 'Sindh']);
    Account::factory()->customer()->create(['city' => 'Karachi', 'region' => 'Punjab']);

    $this->get(route('customers.index', ['city' => 'Lahore', 'region' => 'Punjab']))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->has('customers.data', 1)
            ->where('customers.data.0.id', $match->id)
            ->where('filters.city', 'Lahore')
            ->where('filters.region', 'Punjab'));
});

test('city and region options list distinct customer values only', function (): void {
    Account::factory()->customer()->create(['city' => 'Lahore', 'region' => 'Punjab']);
    Account::factory()->customer()->create(['city' => 'Lahore', 'region' => '']);
    Account::factory()->customer()->create(['city' => null, 'region' => 'Sindh']);
    Account::factory()->sales()->create(['city' => 'Quetta', 'region' => 'Balochistan']);

    $this->get(route('customers.index'))
        ->assertInertia(fn (Assert $page): Assert => $page
            ->where('cityOptions', [['value' => 'Lahore', 'label' => 'Lahore']])
            ->where('regionOptions', [
                ['value' => 'Punjab', 'label' => 'Punjab'],
                ['value' => 'Sindh', 'label' => 'Sindh'],
            ]));
});

test('the create page is displayed', function (): void {
    $this->get(route('customers.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page->component('sales/customers/create'));
});

test('a customer can be created', function (): void {
    $this->post(route('customers.store'), validCustomerPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'))
        ->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Customer Al-Noor Textiles created.']);

    $customer = Account::query()->sole();

    expect($customer->type)->toBe(AccountType::Customer)
        ->and($customer->name)->toBe('Al-Noor Textiles')
        ->and($customer->email)->toBe('orders@alnoor.test')
        ->and($customer->city)->toBe('Lahore');
});

test('creating a customer requires a name', function (): void {
    $this->post(route('customers.store'), [])
        ->assertSessionHasErrors(['name' => 'The name field is required.'])
        ->assertSessionDoesntHaveErrors(['phone', 'email', 'address_line_1', 'city', 'region']);

    expect(Account::query()->count())->toBe(0);
});

test('a customer email must be a valid address', function (): void {
    $this->post(route('customers.store'), validCustomerPayload(['email' => 'not-an-email']))
        ->assertSessionHasErrors(['email' => 'The email field must be a valid email address.']);
});

test('the edit page is displayed', function (): void {
    $customer = Account::factory()->customer()->create();

    $this->get(route('customers.edit', $customer))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('sales/customers/edit')
            ->where('customer.id', $customer->id)
            ->where('customer.name', $customer->name));
});

test('a customer can be updated', function (): void {
    $customer = Account::factory()->customer()->create();

    $this->put(route('customers.update', $customer), validCustomerPayload(['name' => 'Al-Noor Mills']))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'))
        ->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Customer Al-Noor Mills updated.']);

    expect($customer->refresh())
        ->name->toBe('Al-Noor Mills')
        ->city->toBe('Lahore')
        ->type->toBe(AccountType::Customer);
});

test('updating a customer reports the address with its label', function (): void {
    $customer = Account::factory()->customer()->create();

    $this->put(route('customers.update', $customer), validCustomerPayload(['address_line_1' => str_repeat('a', 256)]))
        ->assertSessionHasErrors(['address_line_1' => 'The address field must not be greater than 255 characters.']);
});

test('a customer can be deleted', function (): void {
    $customer = Account::factory()->customer()->create(['name' => 'Al-Noor Textiles']);

    $this->from(route('customers.index'))
        ->delete(route('customers.destroy', $customer))
        ->assertRedirect(route('customers.index'))
        ->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Customer Al-Noor Textiles deleted.']);

    $this->assertModelMissing($customer);
});
