<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
    
        $this->call([
            HurufSeeder::class,
            ContohPenggunaanSeeder::class,
            GambarHurufSeeder::class,
            LevelSeeder::class,
            KosakataSeeder::class,
            BentukKosakataSeeder::class,
            ContohKalimatSeeder::class,
            PembelajaranSeeder::class
        ]);

        User::create([
            'nama_pengguna' => 'admin',
            'nama_lengkap' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'peran' => 'admin',
        ]);
    }
}
