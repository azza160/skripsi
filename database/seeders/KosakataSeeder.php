<?php

namespace Database\Seeders;

use App\Models\Kosakata;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KosakataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kosakata::insert([
            [
                'id' => 'KOSA-001',
                'kanji' => '食べる',
                'furigana' => 'たべる',
                'romaji' => 'taberu',
                'arti' => 'makan',
                'deskripsi' => 'Digunakan untuk menyatakan aktivitas makan.',
                'catatan' => 'Kereta di Jepang sangat tepat waktu.',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-002',
                'kanji' => '行く',
                'furigana' => 'いく',
                'romaji' => 'iku',
                'arti' => 'pergi',
                'deskripsi' => 'Digunakan saat menyatakan pergi ke tempat.',
                'catatan' => 'Bahkan jika terlambat sedikit saja, akan ada pengumuman.',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-003',
                'kanji' => '見る',
                'furigana' => 'みる',
                'romaji' => 'miru',
                'arti' => 'melihat',
                'deskripsi' => 'Digunakan untuk menyatakan tindakan melihat.',
                'catatan' => '',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-009',
                'kanji' => '聞く',
                'furigana' => 'きく',
                'romaji' => 'kiku',
                'arti' => 'mendengar',
                'deskripsi' => 'Digunakan untuk menyatakan tindakan mendengar atau bertanya.',
                'catatan' => '',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-010',
                'kanji' => '読む',
                'furigana' => 'よむ',
                'romaji' => 'yomu',
                'arti' => 'membaca',
                'deskripsi' => 'Digunakan untuk menyatakan tindakan membaca.',
                'catatan' => '',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-011',
                'kanji' => '書く',
                'furigana' => 'かく',
                'romaji' => 'kaku',
                'arti' => 'menulis',
                'deskripsi' => 'Digunakan untuk menyatakan tindakan menulis.',
                'catatan' => '',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-012',
                'kanji' => '起きる',
                'furigana' => 'おきる',
                'romaji' => 'okiru',
                'arti' => 'bangun (tidur)',
                'deskripsi' => 'Digunakan untuk menyatakan bangun dari tidur.',
                'catatan' => '',
                'audio' => null,
            ],
            [
                'id' => 'KOSA-013',
                'kanji' => '寝る',
                'furigana' => 'ねる',
                'romaji' => 'neru',
                'arti' => 'tidur',
                'deskripsi' => 'Digunakan untuk menyatakan tindakan tidur.',
                'catatan' => '',
                'audio' => null,
            ]
        ]);
    }
}
