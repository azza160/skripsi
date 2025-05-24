<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuisController extends Controller
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


    public function pilihHurufQuisShow(){
        $user = Auth::user();
        //ambil progress belajar user huruf & check kategori huruf
        $progressHuruf = $user->hurufs()->where('is_learned', true)->pluck('jenis_huruf') ;
       
        //check yang jumlah jenisnya hiragana atau katakana
        $jumlahHiragana = $progressHuruf->countBy()->get('hiragana', 0);
        $jumlahKatakana = $progressHuruf->countBy()->get('katakana', 0);
    
       
        return Inertia::render('User/Pilih-Huruf-Quis',[
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'jumlahHiragana' => $jumlahHiragana,
            'jumlahKatakana' => $jumlahKatakana,
        ]);
    }

    public function pilihLevelQuisShow($jenis){
     
        $user = Auth::user();
        //ambil progress belajar user huruf & check kategori huruf
        $progressHuruf = $user->hurufs()->where('is_learned', true)->where('jenis_huruf', $jenis)->count();
        
        return Inertia::render('User/Pilih-Level-Quis',[
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'jenis' => $jenis,
            'progressHuruf' => $progressHuruf,
        ]);
    }

    public function pilihListHurufQuis(Request $request){
        $user = Auth::user();
        $jenis = $request->query('jenis');
        $level = $request->query('level');
       
        // Base query for learned letters
        $query = $user->hurufs()
            ->wherePivot('is_learned', true)
            ->where('jenis_huruf', $jenis)
            ->with(['contohPenggunaans' => function($query) {
                $query->take(1); // Get only first example
            }]);

        // Filter by level
        switch($level) {
            case 'beginner':
                $query->where('kategori_huruf', 'gojuon');
                break;
            case 'intermediate':
                $query->whereIn('kategori_huruf', ['gojuon', 'dakuten', 'handakuten']);
                break;
            case 'advanced':
                // No additional filtering needed, get all categories
                break;
        }

        // Get the letters
        $letters = $query->get();
      

        // Transform data to match frontend structure
        $transformedLetters = $letters->map(function($letter) {
            $example = $letter->contohPenggunaans->first();
            return [
                'id' => $letter->id,
                'character' => $letter->huruf,
                'romaji' => $letter->romaji,
                'example' => $example ? "{$example->kata} ({$example->romaji}) - {$example->arti}" : null,
                'group' => $letter->groups,
                'audio' => $letter->audio
            ];
        })->values()->toArray();

       

        // Group letters by their group
        $letterGroups = collect($transformedLetters)
            ->groupBy('group')
            ->map(function($group) {
                return [
                    'id' => $group->first()['group'],
                    'name' => 'Group ' . strtoupper($group->first()['group']),
                    'count' => $group->count()
                ];
            })->values()->toArray();

        // Add "All Letters" group
        array_unshift($letterGroups, [
            'id' => 'all',
            'name' => 'Semua Huruf',
            'count' => count($transformedLetters)
        ]);

    

        return Inertia::render('User/Pilih-List-Huruf-Quis', [
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'letters' => $transformedLetters,
            'letterGroups' => $letterGroups,
            'jenis' => $jenis,
            'level' => $level
        ]);
    }

    public function QuisShow(){
        $user = Auth::user();
        return Inertia::render('User/Quis',[
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
        ]);
    }

    public function ReviewQuisShow(){
        $user = Auth::user();
        return Inertia::render('User/Review-Quis',[
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
        ]);
    }
        
        


}
