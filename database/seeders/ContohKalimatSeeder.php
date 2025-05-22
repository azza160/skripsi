<?php

namespace Database\Seeders;

use App\Models\ContohKalimat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContohKalimatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContohKalimat::insert([
            // Kosakata only
            [
                'kosakata_id' => 'KOSA-001',
                'bentuk_kosakata_id' => null,
                'kanji' => '私はりんごを食べる',
                'furigana' => 'わたしはりんごをたべる',
                'romaji' => 'watashi wa ringo o taberu',
                'arti' => 'Saya makan apel',
                'audio' => null,
            ],
            [
                'kosakata_id' => 'KOSA-002',
                'bentuk_kosakata_id' => null,
                'kanji' => '彼は学校へ行く',
                'furigana' => 'かれはがっこうへいく',
                'romaji' => 'kare wa gakkou e iku',
                'arti' => 'Dia pergi ke sekolah',
                'audio' => null,
            ],
            [
                'kosakata_id' => 'KOSA-003',
                'bentuk_kosakata_id' => null,
                'kanji' => '私は映画を見る',
                'furigana' => 'わたしはえいがをみる',
                'romaji' => 'watashi wa eiga o miru',
                'arti' => 'Saya menonton film',
                'audio' => null,
            ],

            // Bentuk kosakata only (6 data)
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-001',
                'kanji' => '私はりんごを食べます',
                'furigana' => 'わたしはりんごをたべます',
                'romaji' => 'watashi wa ringo o tabemasu',
                'arti' => 'Saya makan apel (sopan)',
                'audio' => null,
            ],
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-002',
                'kanji' => '私はりんごを食べない',
                'furigana' => 'わたしはりんごをたべない',
                'romaji' => 'watashi wa ringo o tabenai',
                'arti' => 'Saya tidak makan apel',
                'audio' => null,
            ],
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-003',
                'kanji' => '彼は学校へ行きます',
                'furigana' => 'かれはがっこうへいきます',
                'romaji' => 'kare wa gakkou e ikimasu',
                'arti' => 'Dia pergi ke sekolah (sopan)',
                'audio' => null,
            ],
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-004',
                'kanji' => '彼は学校へ行かない',
                'furigana' => 'かれはがっこうへいかない',
                'romaji' => 'kare wa gakkou e ikanai',
                'arti' => 'Dia tidak pergi ke sekolah',
                'audio' => null,
            ],
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-005',
                'kanji' => '私は映画を見ます',
                'furigana' => 'わたしはえいがをみます',
                'romaji' => 'watashi wa eiga o mimasu',
                'arti' => 'Saya menonton film (sopan)',
                'audio' => null,
            ],
            [
                'kosakata_id' => null,
                'bentuk_kosakata_id' => 'BENTUK-006',
                'kanji' => '私は映画を見ない',
                'furigana' => 'わたしはえいがをみない',
                'romaji' => 'watashi wa eiga o minai',
                'arti' => 'Saya tidak menonton film',
                'audio' => null,
            ],
        ]);
    }
}
