<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AccountType;
use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property AccountType $type
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address_line_1
 * @property string|null $city
 * @property string|null $region
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Account extends BaseModel
{
    /** @use HasFactory<AccountFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => AccountType::class,
        ];
    }
}
