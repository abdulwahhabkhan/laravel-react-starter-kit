<?php

namespace App\Http\Requests;

use App\Enums\UnitOfMeasure;
use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreOrderItemRequest extends FormRequest
{
    /**
     * Only orders that still accept line changes can be edited.
     */
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->status->allowsLineChanges();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', Rule::exists('products', 'id')],
            'description' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric', 'gt:0', 'max:999999999'],
            'uom' => ['required', Rule::enum(UnitOfMeasure::class)],
            'unit_price' => ['required', 'numeric', 'min:0', 'max:9999999999'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    /**
     * Keep the line discount within the gross value of the line.
     *
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $gross = (float) $this->input('quantity') * (float) $this->input('unit_price');

                if ((float) $this->input('discount', 0) > round($gross, 2)) {
                    $validator->errors()->add('discount', __('The discount cannot be more than the line value.'));
                }
            },
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
            'product_id' => 'product',
            'uom' => 'unit',
        ];
    }
}
