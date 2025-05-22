<?php

namespace App\Http\Controllers;

use App\Models\Contoh_Penggunaan;
use App\Models\Gambar_Huruf;
use App\Models\Huruf;
use App\Models\Pembelajaran;
use App\Models\UserBelajar;
use App\Models\UserHuruf;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function Laravel\Prompts\progress;

class HurufController extends Controller
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
    
    public function pilihHuruf(){
        $user = auth()->user();

        return Inertia::render('User/Huruf',[
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'user' => $user,
        ]);
    }

    public function kategoriHiragana(){
        $user = auth()->user();

        //ambil data dari table user_belajar yang pembelajaran_id nya belajar-hiragana-gojuon
        $userBelajar = UserBelajar::where('pembelajaran_id', 'belajar-hiragana-gojuon')->first();
        $progress_gojuon = $userBelajar ? $userBelajar->progress : 0;

        


     
        
        
 
        // ambil dari table user_belajar data dengan users_id nya sama dengan user id yang sedang login,lalu pembelajaran_id nya yang mengandung belajar-hiragana-
        $progress = UserBelajar::where('user_id', $user->id)->where('pembelajaran_id', 'like', 'belajar-hiragana-%')->get();

 
        // Define default categories with their max values
        $categories = [
            'gojuon' => [
                'max' => 46,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'dakuten' => [
                'max' => 20,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'handakuten' => [
                'max' => 5,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'youon' => [
                'max' => 36,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'sokuon' => [
                'max' => 1,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'choon' => [
                'max' => 5,
                'status' => 'belum mulai',
                'progress' => 0
            ]
        ];

        //ambil dari progress data yang sudah ada di table user_belajar,lalu masukan ke dalam array categories data progress dan status
        foreach ($progress as $item) {
            $category = str_replace('belajar-hiragana-', '', $item->pembelajaran_id);
            $categories[$category]['progress'] = $item->progress;
            $categories[$category]['status'] = $item->status;
        }

       

    

        return Inertia::render('User/Kategori-Hiragana', [
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'user' => $user,
            'categoriesProgress' => $categories,
            'progress_gojuon' => $progress_gojuon
        ]);
    }

    public function kategoriKatakana(){
        $user = auth()->user();

        //ambil data dari table user_belajar yang pembelajaran_id nya belajar-katakana-gojuon
        $userBelajar = UserBelajar::where('pembelajaran_id', 'belajar-katakana-gojuon')->first();
        $progress_gojuon = $userBelajar ? $userBelajar->progress : 0;

        // ambil dari table user_belajar data dengan users_id nya sama dengan user id yang sedang login,lalu pembelajaran_id nya yang mengandung belajar-katakana-
        $progress = UserBelajar::where('user_id', $user->id)->where('pembelajaran_id', 'like', 'belajar-katakana-%')->get();

        // Define default categories with their max values
        $categories = [
            'gojuon' => [
                'max' => 46,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'dakuten' => [
                'max' => 20,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'handakuten' => [
                'max' => 5,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'youon' => [
                'max' => 33,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'sokuon' => [
                'max' => 1,
                'status' => 'belum mulai',
                'progress' => 0
            ],
            'choon' => [
                'max' => 5,
                'status' => 'belum mulai',
                'progress' => 0
            ]
        ];

        //ambil dari progress data yang sudah ada di table user_belajar,lalu masukan ke dalam array categories data progress dan status
        foreach ($progress as $item) {
            $category = str_replace('belajar-katakana-', '', $item->pembelajaran_id);
            $categories[$category]['progress'] = $item->progress;
            $categories[$category]['status'] = $item->status;
        }

        return Inertia::render('User/Kategori-Katakana', [
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'user' => $user,
            'categoriesProgress' => $categories,
            'progress_gojuon' => $progress_gojuon
        ]);
    }

    public function showDetailHuruf($jenis, $kategori, $id)
    {
        $user = auth()->user();
        $huruf = Huruf::where('id', $id)->first();
        $contoh_penggunaan = Contoh_Penggunaan::where('huruf_id', $huruf->id)->get();
        $gambar_huruf = Gambar_Huruf::where('huruf_id', $huruf->id)->get();



        //cek apakah huruf sudah di pelajari di table user_huruf
        $isLearned = UserHuruf::where('user_id', $user->id)->where('huruf_id', $huruf->id)->first();
        
        $status = $isLearned ? $isLearned->is_learned : false;
        //check apakah null atau tidak
        $isNull = $isLearned ? false : true;
        
        return Inertia::render('User/Detail-Huruf', [

            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'huruf' => $huruf,
            'contoh_penggunaan' => $contoh_penggunaan,
            'gambar_huruf' => $gambar_huruf,
            'jenis' => $jenis,
            'kategori' => $kategori,
            'idList' => request()->input('idList'),
            'user' => $user,
            'status' => $status,
            'isNull' => $isNull
        ]);
    }

    public function GetHurufByKategori($jenis, $kategori)
    {
        $user = auth()->user();
        
        // Validasi manual untuk jenis dan kategori huruf
        $allowedJenis = ['hiragana', 'katakana'];
        $allowedKategori = ['gojuon', 'dakuten', 'handakuten', 'youon', 'sokuon', 'choon'];

       

        if (!in_array($jenis, $allowedJenis) || !in_array($kategori, $allowedKategori)) {
            abort(404);
        }

        // Get user's learning progress
        $progress = UserBelajar::where('user_id', $user->id)
            ->where('pembelajaran_id', 'like', "belajar-{$jenis}-%")
            ->get()
            ->mapWithKeys(function ($item) use ($jenis) {
                $category = str_replace("belajar-{$jenis}-", '', $item->pembelajaran_id);
                return [$category => $item->progress];
            });
        

        // Check if category should be locked
        $isLocked = false;
        switch($kategori) {
            case 'gojuon':
                $isLocked = false; // Always unlocked
                break;
            case 'dakuten':
                $isLocked = ($progress['gojuon'] ?? 0) < 45;
                break;
            case 'handakuten':
                $isLocked = ($progress['dakuten'] ?? 0) < 20;
                break;
            case 'youon':
                $isLocked = ($progress['handakuten'] ?? 0) < 5;
                break;
            case 'sokuon':
                $isLocked = ($progress['youon'] ?? 0) < 35;
                break;
            case 'choon':
                $isLocked = ($progress['sokuon'] ?? 0) < 1;
                break;
        }

        // If category is locked, redirect back with error message
        if ($isLocked) {
            return redirect()->back()->with('error', 'Anda harus menyelesaikan kategori sebelumnya terlebih dahulu.');
        }

        // Get all hurufs for the specified jenis and kategori
        $hurufs = Huruf::where('jenis_huruf', $jenis)
            ->where('kategori_huruf', $kategori)
            ->orderBy('id')
            ->get();

        // Get learned hurufs for the current user
        $learnedHurufs = $user->hurufs()
            ->where('is_learned', true)
            ->pluck('hurufs.id')  // Specify the table name for id
            ->toArray();

        // Add is_learned status to each huruf
        $hurufs = $hurufs->map(function ($huruf) use ($learnedHurufs) {
            $huruf->is_learned = in_array($huruf->id, $learnedHurufs);
            return $huruf;
        });

        //mengambil data progress dari table user_belajar
        $progress = UserBelajar::where('user_id', $user->id)
    ->where('pembelajaran_id', "belajar-{$jenis}-{$kategori}")
    ->first()?->progress ?? 0;

        
        //mengambil nilai max pada data pembelajaran yang terkait dengan kategori
        $max = Pembelajaran::where('id', "belajar-{$jenis}-{$kategori}")->first()->max;
      
      
        //hitung presentase progress dengan maximal nilai 100%
        $presentase = ($progress / $max) * 100;

       

        return Inertia::render('User/List-Huruf', [
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'hurufs' => $hurufs,
            'jenis' => $jenis,
            'kategori' => $kategori,
            'user' => $user,
            'presentase' => $presentase,
            'max' => $max
        ]);
    }
}
