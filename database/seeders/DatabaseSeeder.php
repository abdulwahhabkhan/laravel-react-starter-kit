<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        foreach (Role::cases() as $role) {
            User::factory()->create([
                'name' => "{$role->label()} User",
                'email' => $role->demoEmail(),
                'role' => $role,
            ]);
        }
    }
}
