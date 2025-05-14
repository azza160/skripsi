<?php

namespace Database\Seeders;

use App\Models\Gambar_Huruf;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GambarHurufSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gambar_Huruf::create([
            'link' => 'https://res.cloudinary.com/dzozxilf6/image/upload/v1747055786/a_1_fyyian.png', // Link gambar
            'urutan' => 1,
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id huruf
        ]);

        Gambar_Huruf::create([
            'link' => 'https://res.cloudinary.com/dzozxilf6/image/upload/v1747056100/a_2_lp1her.png',
            'urutan' => 2,
            'huruf_id' => 'H-GO-A',
        ]);

        Gambar_Huruf::create([
            'link' => 'https://res.cloudinary.com/dzozxilf6/image/upload/v1747056302/a_3_o9dhz8.png',
            'urutan' => 3,
            'huruf_id' => 'H-GO-A',
        ]);

    }
}
