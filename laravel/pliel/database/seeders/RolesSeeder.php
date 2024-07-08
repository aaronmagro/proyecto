<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        Role::create(['name' => 'ROLE_ADMIN']);
        Role::create(['name' => 'ROLE_USER']);
    }
}
