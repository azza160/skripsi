<?php

namespace Database\Seeders;

use App\Models\Contoh_Penggunaan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContohPenggunaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contoh_Penggunaan::create([
            'kata' => 'ありがとう',
            'romaji' => 'arigatou',
            'arti' => 'Terima kasih',
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id dari huruf
        ]);

        Contoh_Penggunaan::create([
            'kata' => 'ありがとうasdasd',
            'romaji' => 'arigasdasdatou',
            'arti' => 'Terima kasih',
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id dari huruf
        ]);

        Contoh_Penggunaan::create([
            'kata' => 'ありがとう',
            'romaji' => 'arigxzzxczxatou',
            'arti' => 'Terima kzxzxzxasih',
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id dari huruf
        ]);

        Contoh_Penggunaan::create([
            'kata' => 'ありzzzがとう',
            'romaji' => 'arigaasdasdtou',
            'arti' => 'Terima kasih',
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id dari huruf
        ]);
    }
}
