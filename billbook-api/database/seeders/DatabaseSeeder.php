<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (! User::query()->where('email', 'demo@billbook.local')->exists()) {
            User::factory()->create([
                'name' => 'Acme Studio',
                'email' => 'demo@billbook.local',
            ]);
        }

        $this->call([
            BillBookSeeder::class,
        ]);
    }
}
