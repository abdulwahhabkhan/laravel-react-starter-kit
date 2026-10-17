<?php

namespace App\Http\Controllers;

use App\Enums\AccountType;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Account;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * List customers (accounts where type = customer).
     */
    public function index(Request $request): Response
    {
        $search = mb_trim($request->string('search')->toString());
        $city = mb_trim($request->string('city')->toString());
        $region = mb_trim($request->string('region')->toString());

        $customers = Account::query()->customer()
            ->when($search !== '', fn (Builder $query) => $query->where(
                fn (Builder $query) => $query
                    ->whereLike('name', "%{$search}%")
                    ->orWhereLike('phone', "%{$search}%")
                    ->orWhereLike('email', "%{$search}%"),
            ))
            ->when($city !== '', fn (Builder $query) => $query->where('city', $city))
            ->when($region !== '', fn (Builder $query) => $query->where('region', $region))
            ->latest('updated_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Account $account): array => $this->customerData($account));

        $cityOptions = Account::query()->customer()
            ->select('city')
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->distinct()
            ->orderBy('city')
            ->pluck('city')
            ->map(fn (string $city): array => ['value' => $city, 'label' => $city])
            ->values();

        $regionOptions = Account::query()->customer()
            ->select('region')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->distinct()
            ->orderBy('region')
            ->pluck('region')
            ->map(fn (string $region): array => ['value' => $region, 'label' => $region])
            ->values();

        return Inertia::render('sales/customers/index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'city' => $city,
                'region' => $region,
            ],
            'cityOptions' => $cityOptions,
            'regionOptions' => $regionOptions,
        ]);
    }

    /**
     * Show the form for creating a customer.
     */
    public function create(): Response
    {
        return Inertia::render('sales/customers/create');
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $account = Account::query()->create([
            'type' => AccountType::Customer,
            ...$request->validated(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Customer :name created.', ['name' => $account->name])]);

        return to_route('customers.index');
    }

    /**
     * Show the form for editing a customer.
     */
    public function edit(Account $customer): Response
    {
        return Inertia::render('sales/customers/edit', [
            'customer' => $this->customerData($customer),
        ]);
    }

    /**
     * Update the given customer.
     */
    public function update(UpdateCustomerRequest $request, Account $customer): RedirectResponse
    {
        $customer->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Customer :name updated.', ['name' => $customer->name])]);

        return to_route('customers.index');
    }

    /**
     * Delete the given customer.
     */
    public function destroy(Account $customer): RedirectResponse
    {
        $name = $customer->name;

        $customer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Customer :name deleted.', ['name' => $name])]);

        return back();
    }

    /**
     * Shape an account for the frontend as a customer.
     *
     * @return array{id: int, name: string, phone: string|null, email: string|null, address_line_1: string|null, city: string|null, region: string|null, updated_at: string|null}
     */
    private function customerData(Account $account): array
    {
        return [
            'id' => $account->id,
            'name' => $account->name,
            'phone' => $account->phone,
            'email' => $account->email,
            'address_line_1' => $account->address_line_1,
            'city' => $account->city,
            'region' => $account->region,
            'updated_at' => $account->updated_at?->toIso8601String(),
        ];
    }
}
