<?php

namespace App\Http\Controllers;

use App\Models\BentukKosakata;
use App\Models\ContohKalimat;
use App\Models\Kosakata;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Whoops\Exception\Formatter;

class KosakataController extends Controller
{

    private function calculateNextLevelExp($currentLevel)
    {
        $levelConfigs = config('exp.levels'); // ambil dari config/exp.php
     
        // Ambil semua level yang tersedia
        $availableLevels = array_keys($levelConfigs);
    
        // Ambil level maksimal dari config
        $maxLevel = max($availableLevels);

        // Kalau sudah level max, tidak bisa naik lagi
        if ($currentLevel >= $maxLevel) {
            return null; // null = tidak ada level berikutnya
        }
        
        return $levelConfigs[$currentLevel]['max_exp'] ?? null;
    }

    public function getAllKosakata()
    {
        $user = Auth::user();
        
        // Ambil semua kosakata
        $kosakatas = Kosakata::with('contohKalimats')->get();

        // Ambil data user_kosakatas dan transform ke associative array untuk lookup yang lebih cepat
        $userKosakatas = $user->kosakatas()
            ->select('kosakatas.id', 'user_kosakatas.is_favorite', 'user_kosakatas.is_learned', 'user_kosakatas.last_completed_at')
            ->get()
            ->keyBy('id');

        $formatted = $kosakatas->map(function ($item) use ($userKosakatas) {
            $contoh = $item->contohKalimats->first(); // Ambil 1 contoh kalimat saja
            $userKosakata = $userKosakatas[$item->id] ?? null;

            return [
                'id' => $item->id,
                'kanji' => $item->kanji,
                'furigana' => $item->furigana,
                'romaji' => $item->romaji,
                'meaning' => $item->arti,
                'audio' => $item->audio,
                //check data isFavorite,jika dari pivot nilainya 1 maka true, jika 0 maka false dan jika null maka false
                'isFavorite' => $userKosakata ? ($userKosakata->pivot->is_favorite ? true : false) : false,
                'isLearned' => $userKosakata ? ($userKosakata->pivot->is_learned ? true : false) : false,
                'category' => 'umum', // default atau bisa tambahkan kolom kategori nanti
                'example' => $contoh?->kanji,
                'exampleFurigana' => $contoh?->furigana,
                'exampleRomaji' => $contoh?->romaji,
                'exampleMeaning' => $contoh?->arti,
                'level' => 'N5', // default juga
                'lastStudied' => $userKosakata ? $userKosakata->pivot->last_completed_at : null,
            ];
        });

    
        return Inertia::render('User/List-Kosakata', [
            'user' => $user,
            'sample_vocabulary' => $formatted,    
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),      
        ]);
    }

    public function getDetailKosakata($id){

        $user = Auth::user();

        $kosakata = Kosakata::with([
            'bentukKosakatas.contohKalimats',
            'contohKalimats',
        ])->findOrFail($id);
    
        // Mapping struktur data yang frontend butuhkan
        $data = [
            'user' => $user,
            'id' => $kosakata->id,
            'word' => $kosakata->kanji ?? $kosakata->romaji,
            'kanji' => $kosakata->kanji,
            'furigana' => $kosakata->furigana,
            'romaji' => $kosakata->romaji,
            'meaning' => $kosakata->arti,
            'type' => 'verb', // misal masih hardcoded, nanti bisa dari kolom baru
            'level' => 'N5', // nanti bisa dari kolom baru
            'progress' => 65, // hardcoded sementara
            'isFavorite' => false, // bisa dari relasi user ke kosakata
            'isLearned' => false,  // bisa dari relasi user ke progress
            'audio' => $kosakata->audio,
    
            'examples' => $kosakata->contohKalimats->map(function ($ex) {
                return [
                    'id' => $ex->id,
                    'kanji' => $ex->kanji,
                    'furigana' => $ex->furigana,
                    'romaji' => $ex->romaji,
                    'meaning' => $ex->arti,
                    'audio' => $ex->audio,
                ];
            }),
    
            'conjugations' => $kosakata->bentukKosakatas->map(function ($bentuk) {
                return [
                    'form' => $bentuk->bentuk,
                    'kanji' => $bentuk->kanji,
                    'furigana' => $bentuk->furigana,
                    'romaji' => $bentuk->romaji,
                    'meaning' => $bentuk->arti,
                    'audio' => $bentuk->audio,
                    'examples' => $bentuk->contohKalimats->map(function ($kalimat) {
                        return [
                            'kanji' => $kalimat->kanji,
                            'furigana' => $kalimat->furigana,
                            'romaji' => $kalimat->romaji,
                            'meaning' => $kalimat->arti,
                            'audio' => $kalimat->audio,
                        ];
                    }),
                ];
            }),
    
            'mnemonics' => $kosakata->deskripsi, // nanti bisa tambahin field baru
            'notes' => $kosakata->catatan,
            'stats' => [
                'views' => 1234, // misal placeholder dulu
                'learners' => 567,
                'favorites' => 89,
                'lastUpdated' => $kosakata->updated_at ? $kosakata->updated_at->format('Y-m-d') : null,
            ],
            'tags' => ['食べ物', '動詞'], // nanti bisa dari tabel relasi tags
        ];

        
    
        return Inertia::render('User/Detail-Kosakata', [
            'kosakata' => $data,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'user' => $user,
            'maxExp' => $this->calculateNextLevelExp($user->level),
        ]);     
    }

    public function flashcard(){
        $user = Auth::user();

      

        return Inertia::render('User/Flashcard', [
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
        ]);
    }
}
