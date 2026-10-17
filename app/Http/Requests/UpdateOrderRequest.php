<?php

namespace App\Http\Requests;

use App\Enums\AccountType;
use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Order $order */
        $order = $this->route('order');

        return [
            'account_id' => [
                'required',
                'integer',
                // The current account stays valid even if it is not a customer account.
                Rule::exists('accounts', 'id')->where(fn (Builder $query) => $query
                    ->where('type', AccountType::Customer->value)
                    ->orWhere('id', $order->account_id)),
            ],
            'status' => ['required', Rule::enum(OrderStatus::class)],
            'order_date' => ['required', 'date'],
            'delivery_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Get custom attributes for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'account_id' => 'customer',
        ];
    }
}
