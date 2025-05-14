<?php

namespace Database\Seeders;

use App\Models\Huruf;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class HurufSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('hurufs')->insert([
            // Hiragana - Gojuon
            [
                'id' => 'H-GO-A',
                'huruf' => 'あ',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf vokal pertama dalam hiragana.',
                'romaji' => 'a',
                'jumlah_coretan' => 3,
                'kategori' => 'vokal',
                'groups' => 'a',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'H-GO-KA',
                'huruf' => 'か',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf konsonan "ka" dalam hiragana.',
                'romaji' => 'ka',
                'jumlah_coretan' => 3,
                'kategori' => 'non vokal',
                'groups' => 'ka',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'H-GO-SA',
                'huruf' => 'さ',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf konsonan "sa" dalam hiragana.',
                'romaji' => 'sa',
                'jumlah_coretan' => 3,
                'kategori' => 'non vokal',
                'groups' => 'sa',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Hiragana - Dakuten
            [
                'id' => 'H-DA-GA',
                'huruf' => 'が',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'dakuten',
                'deskripsi' => 'Bersuara dari "ka", digunakan dalam kata benda.',
                'romaji' => 'ga',
                'jumlah_coretan' => 3,
                'kategori' => 'non vokal',
                'groups' => 'ga',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'H-DA-GI',
                'huruf' => 'ぎ',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'dakuten',
                'deskripsi' => 'Bersuara dari "ki".',
                'romaji' => 'gi',
                'jumlah_coretan' => 3,
                'kategori' => 'non vokal',
                'groups' => 'ga',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'H-DA-GU',
                'huruf' => 'ぐ',
                'jenis_huruf' => 'hiragana',
                'kategori_huruf' => 'dakuten',
                'deskripsi' => 'Bersuara dari "ku".',
                'romaji' => 'gu',
                'jumlah_coretan' => 3,
                'kategori' => 'non vokal',
                'groups' => 'ga',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Katakana - Gojuon
            [
                'id' => 'K-GO-A',
                'huruf' => 'ア',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf vokal pertama dalam katakana.',
                'romaji' => 'a',
                'jumlah_coretan' => 2,
                'kategori' => 'vokal',
                'groups' => 'a',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'K-GO-KA',
                'huruf' => 'カ',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf konsonan "ka" dalam katakana.',
                'romaji' => 'ka',
                'jumlah_coretan' => 2,
                'kategori' => 'non vokal',
                'groups' => 'ka',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'K-GO-SA',
                'huruf' => 'サ',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'gojuon',
                'deskripsi' => 'Huruf konsonan "sa" dalam katakana.',
                'romaji' => 'sa',
                'jumlah_coretan' => 2,
                'kategori' => 'non vokal',
                'groups' => 'sa',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // Katakana - Handakuten
            [
                'id' => 'K-HA-PA',
                'huruf' => 'パ',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'handakuten',
                'deskripsi' => 'Bersuara dari "ha" menggunakan simbol lingkaran kecil.',
                'romaji' => 'pa',
                'jumlah_coretan' => 2,
                'kategori' => 'non vokal',
                'groups' => 'pa',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'K-HA-PI',
                'huruf' => 'ピ',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'handakuten',
                'deskripsi' => 'Bersuara dari "hi" menggunakan simbol lingkaran kecil.',
                'romaji' => 'pi',
                'jumlah_coretan' => 2,
                'kategori' => 'non vokal',
                'groups' => 'pa',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 'K-HA-PU',
                'huruf' => 'プ',
                'jenis_huruf' => 'katakana',
                'kategori_huruf' => 'handakuten',
                'deskripsi' => 'Bersuara dari "fu" (hu) menggunakan simbol lingkaran kecil.',
                'romaji' => 'pu',
                'jumlah_coretan' => 2,
                'kategori' => 'non vokal',
                'groups' => 'pa',
                'catatan' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
