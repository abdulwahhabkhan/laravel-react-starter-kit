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
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => Role::Admin->demoEmail(),
        ]);

        User::factory()->create([
            'name' => 'Demo User',
            'email' => Role::User->demoEmail(),
        ]);

        $this->call([
            ProductSeeder::class,
            AccountSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
