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
            'audio' => 'https://res.cloudinary.com/dzozxilf6/video/upload/v1747371319/hiragana-a-contoh_penggunaan-arigatou-audio_l310z5.wav',
            'huruf_id' => 'H-GO-A', // Sesuaikan dengan id dari huruf
        ]);

        Contoh_Penggunaan::create([
            'kata' => 'あいさつ',
            'romaji' => 'aisatsu',
            'arti' => 'Salam',
            'audio' => null,
            'huruf_id' => 'H-GO-A',
        ]);
        
        Contoh_Penggunaan::create([
            'kata' => 'あお',
            'romaji' => 'ao',
            'arti' => 'Biru',
            'audio' => null,
            'huruf_id' => 'H-GO-A',
        ]);
        
        Contoh_Penggunaan::create([
            'kata' => 'あめ',
            'romaji' => 'ame',
            'arti' => 'Hujan',
            'audio' => null,
            'huruf_id' => 'H-GO-A',
        ]);
        

     
    }
}
