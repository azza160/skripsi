<?php

namespace Database\Seeders;

use App\Models\BentukKosakata;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BentukKosakataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BentukKosakata::insert([
            // 2 bentuk untuk 'taberu'
            [
                'id' => 'BENTUK-001',
                'id_kosakata' => 'KOSA-001',
                'bentuk' => 'sopan',
                'kanji' => '食べます',
                'furigana' => 'たべます',
                'romaji' => 'tabemasu',
                'arti' => 'makan (sopan)',
                'deskripsi' => 'Bentuk sopan dari taberu.',
                'audio' => null,
            ],
            [
                'id' => 'BENTUK-002',
                'id_kosakata' => 'KOSA-001',
                'bentuk' => 'negatif',
                'kanji' => '食べない',
                'furigana' => 'たべない',
                'romaji' => 'tabenai',
                'arti' => 'tidak makan',
                'deskripsi' => 'Bentuk negatif dari taberu.',
                'audio' => null,
            ],

            // 2 bentuk untuk 'iku'
            [
                'id' => 'BENTUK-003',
                'id_kosakata' => 'KOSA-002',
                'bentuk' => 'sopan',
                'kanji' => '行きます',
                'furigana' => 'いきます',
                'romaji' => 'ikimasu',
                'arti' => 'pergi (sopan)',
                'deskripsi' => 'Bentuk sopan dari iku.',
                'audio' => null,
            ],
            [
                'id' => 'BENTUK-004',
                'id_kosakata' => 'KOSA-002',
                'bentuk' => 'negatif',
                'kanji' => '行かない',
                'furigana' => 'いかない',
                'romaji' => 'ikanai',
                'arti' => 'tidak pergi',
                'deskripsi' => 'Bentuk negatif dari iku.',
                'audio' => null,
            ],

            // 2 bentuk untuk 'miru'
            [
                'id' => 'BENTUK-005',
                'id_kosakata' => 'KOSA-003',
                'bentuk' => 'sopan',
                'kanji' => '見ます',
                'furigana' => 'みます',
                'romaji' => 'mimasu',
                'arti' => 'melihat (sopan)',
                'deskripsi' => 'Bentuk sopan dari miru.',
                'audio' => null,
            ],
            [
                'id' => 'BENTUK-006',
                'id_kosakata' => 'KOSA-003',
                'bentuk' => 'negatif',
                'kanji' => '見ない',
                'furigana' => 'みない',
                'romaji' => 'minai',
                'arti' => 'tidak melihat',
                'deskripsi' => 'Bentuk negatif dari miru.',
                'audio' => null,
            ],
        ]);
    }
}
