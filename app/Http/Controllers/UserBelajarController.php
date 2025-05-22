<?php

namespace App\Http\Controllers;

use App\Models\Huruf;
use App\Models\UserHuruf;
use App\Models\User;
use App\Models\Pembelajaran;
use App\Models\RiwayatExp;
use App\Models\UserBelajar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\UserKosakata;
class UserBelajarController extends Controller
{
    public function updateProgress(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'pembelajaran_id' => 'required|exists:pembelajarans,id',
            'progress' => 'required|integer|min:0',
            'status' => 'required|in:belum selesai,selesai',
        ]);

        // Update atau buat baru record pivot
        $user->pembelajarans()->syncWithoutDetaching([
            $validated['pembelajaran_id'] => [
                'progress' => $validated['progress'],
                'status' => $validated['status'],
                'last_completed_at' => $validated['status'] === 'selesai' ? now() : null,
            ],
        ]);

        return response()->json(['message' => 'Progress berhasil diperbarui'], 200);
    }

    public function updateProgressHuruf(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'pembelajaran_id' => 'required|exists:pembelajarans,id',
            'progress' => 'required|integer|min:0',
            'status' => 'required|in:belum,belajar,selesai',
            'id_huruf' => 'required|exists:hurufs,id',
        ]);

        // Cek apakah huruf sudah dipelajari
        $userHuruf = UserHuruf::where('user_id', $user->id)->where('huruf_id', $validated['id_huruf'])->first();

        // Kalau huruf sudah dipelajari, tidak update progress
        if ($userHuruf && $userHuruf->is_learned) {
            return response()->json(
                [
                    'message' => 'Huruf sudah dipelajari. Tidak ada perubahan.',
                ],
                200,
            );
        }

        // Ambil data pivot pembelajaran
        $existing = $user->pembelajarans()->where('pembelajaran_id', $validated['pembelajaran_id'])->first();

        $newProgress = $validated['progress'];
        $newStatus = $validated['status'];
        $lastCompletedAt = null;

        if ($existing) {
            $currentPivot = $existing->pivot;
            $newProgress = $currentPivot->progress + $validated['progress'];
            $newStatus = $validated['status'] === 'selesai' ? 'selesai' : $currentPivot->status;
            $lastCompletedAt = $newStatus === 'selesai' ? now() : $currentPivot->last_completed_at;
        }

        // Update progress pembelajaran
        $user->pembelajarans()->syncWithoutDetaching([
            $validated['pembelajaran_id'] => [
                'progress' => $newProgress,
                'status' => $newStatus,
                'last_completed_at' => $lastCompletedAt,
            ],
        ]);

        // Update atau insert user_huruf
        UserHuruf::updateOrCreate(
            [
                'user_id' => $user->id,
                'huruf_id' => $validated['id_huruf'],
            ],
            [
                'is_learned' => true,
                'last_completed_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );

        return response()->json(
            [
                'message' => 'Progress dan status huruf berhasil diperbarui',
                'progress' => $newProgress,
                'status' => $newStatus,
            ],
            200,
        );
    }

    public function checkLearningRecord(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'pembelajaran_id' => 'required|string',
        ]);

        $exists = $user->pembelajarans()->where('pembelajaran_id', $validated['pembelajaran_id'])->exists();

        return response()->json(['exists' => $exists]);
    }

    public function updateProgressKategori(Request $request)
    {
        $validated = $request->validate([
            'pembelajaran_id' => 'required|string',
            'progress' => 'required|integer|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            $user = Auth::user();
            $pembelajaran = Pembelajaran::where('id', $validated['pembelajaran_id'])->first();

            if (!$pembelajaran) {
                return response()->json(
                    [
                        'success' => false,
                        'message' => 'Pembelajaran tidak ditemukan',
                    ],
                    404,
                );
            }

            // Cek apakah record sudah ada
            $existing = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $validated['pembelajaran_id'])->first();

            if ($existing) {
                // jika ada jangan lakuka apa apa dan langsung kembali ke halaman sebelumnya
                return response()->json([
                    'success' => true,
                    'message' => 'Progress sudah ada',
                ]);
            } else {
                // Buat record baru
                DB::table('user_belajars')->insert([
                    'user_id' => $user->id,
                    'pembelajaran_id' => $validated['pembelajaran_id'],
                    'progress' => 0,
                    'status' => 'belum selesai',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Progress berhasil diperbarui',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
                ],
                500,
            );
        }
    }

    public function checkKategoriRecord(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'pembelajaran_id' => 'required|string',
        ]);

        $exists = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $validated['pembelajaran_id'])->exists();

        return response()->json(['exists' => $exists]);
    }

    public function updateUserHuruf(Request $request)
    {
        //ambil data user yang login
        $user = Auth::user();

        //check apakah sudah ada data user_huruf dengan user_id dan huruf_id yang sama
        $userHuruf = UserHuruf::where('user_id', $user->id)->where('huruf_id', $request->id_huruf)->first();

        if ($userHuruf && $userHuruf->is_learned) {
            //kembali ke halman sebelumnya sambil mengirimkan pesan
            return response()->json([
                'success' => true,
                'message' => 'Huruf sudah dipelajari',
            ]);
        } elseif ($userHuruf && !$userHuruf->is_learned) {
            //update is_learned menjadi true dan last_completed_at menjadi now
            $userHuruf->update(['is_learned' => true, 'last_completed_at' => now()]);

            //ambil data progress pembelajaran
            $existing = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

            //update progress pembelajaran
            DB::table('user_belajars')
                ->where('user_id', $user->id)
                ->where('pembelajaran_id', $request->pembelajaran_id)
                ->update([
                    'progress' => $existing->progress + 1,
                    'updated_at' => now(),
                ]);

            //ambil data user_belajar yang sudah di update progress
            $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

            //ambil data max dari data pembelajaran
            $maxDataPembelajaran = Pembelajaran::where('id', $request->pembelajaran_id)->first()->max;

            //jika progress sama dengan max maka update status menjadi selesai
            if ($dataUserBelajar->progress == $maxDataPembelajaran) {
                DB::table('user_belajars')
                    ->where('user_id', $user->id)
                    ->where('pembelajaran_id', $request->pembelajaran_id)
                    ->update([
                        'status' => 'selesai',
                        'last_completed_at' => now(),
                        'updated_at' => now(),
                    ]);
            }

            //ambil data user_belajar yang sudah diupdate progress
            $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

            //ambil data user_belajar yang sudah di update progress
            $existing = DB::table('user_belajars')
                ->where('user_id', $user->id)
                ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                ->first();

            //check apakah status dari data user_belajar yang sudah di update progress adalah selesai
            if ($dataUserBelajar->status == 'selesai') {
                //update status menjadi belum selesai
                DB::table('user_belajars')
                    ->where('user_id', $user->id)
                    ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                    ->update(['progress' => $existing->progress + 1, 'updated_at' => now()]);
            }

            //ambil data user_belajar yang sudah di update progress
            $dataUserBelajar = DB::table('user_belajars')
                ->where('user_id', $user->id)
                ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                ->first();

            $pembelajaranHurufMax = Pembelajaran::where('id', $existing->pembelajaran_id)->first()->max;

            //jika progress sama dengan max maka update status menjadi selesai
            if ($dataUserBelajar->progress == $pembelajaranHurufMax) {
                DB::table('user_belajars')
                    ->where('user_id', $user->id)
                    ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                    ->update(['status' => 'selesai', 'last_completed_at' => now(), 'updated_at' => now()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Progress berhasil diperbarui,namun exp tidak bertambah',
            ]);
        }
        else{
            //masukan data user_id dan huruf_id ke table user_huruf,set is_learned menjadi true dan last_completed_at menjadi now
            $dataUserHuruf = UserHuruf::create([
                'user_id' => $user->id,
                'huruf_id' => $request->id_huruf,
                'is_learned' => true,
                'last_completed_at' => now(),
            ]);

              //ambil data progress pembelajaran
              $existing = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

              //update progress pembelajaran
              DB::table('user_belajars')
                  ->where('user_id', $user->id)
                  ->where('pembelajaran_id', $request->pembelajaran_id)
                  ->update([
                      'progress' => $existing->progress + 1,
                      'updated_at' => now(),
                  ]);
  
              //ambil data user_belajar yang sudah di update progress
              $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();
  
              //ambil data max dari data pembelajaran
              $maxDataPembelajaran = Pembelajaran::where('id', $request->pembelajaran_id)->first()->max;
  
              //jika progress sama dengan max maka update status menjadi selesai
              if ($dataUserBelajar->progress == $maxDataPembelajaran) {
                  DB::table('user_belajars')
                      ->where('user_id', $user->id)
                      ->where('pembelajaran_id', $request->pembelajaran_id)
                      ->update([
                          'status' => 'selesai',
                          'last_completed_at' => now(),
                          'updated_at' => now(),
                      ]);
              }
  
              //ambil data user_belajar yang sudah diupdate progress
              $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();
  
              //ambil data user_belajar yang sudah di update progress
              $existing = DB::table('user_belajars')
                  ->where('user_id', $user->id)
                  ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                  ->first();
  
              //check apakah status dari data user_belajar yang sudah di update progress adalah selesai
              if ($dataUserBelajar->status == 'selesai') {
                  //update status menjadi belum selesai
                  DB::table('user_belajars')
                      ->where('user_id', $user->id)
                      ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                      ->update(['progress' => $existing->progress + 1, 'updated_at' => now()]);
              }
  
              //ambil data user_belajar yang sudah di update progress
              $dataUserBelajar = DB::table('user_belajars')
                  ->where('user_id', $user->id)
                  ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                  ->first();
  
              $pembelajaranHurufMax = Pembelajaran::where('id', $existing->pembelajaran_id)->first()->max;
  
              //jika progress sama dengan max maka update status menjadi selesai
              if ($dataUserBelajar->progress == $pembelajaranHurufMax) {
                  DB::table('user_belajars')
                      ->where('user_id', $user->id)
                      ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                      ->update(['status' => 'selesai', 'last_completed_at' => now(), 'updated_at' => now()]);
              }

              $namaHuruf = Huruf::where('id', $request->id_huruf)->first()->nama;

              //masukan data user ke table riwayat_exp
              RiwayatExp::create([
                'nama' => 'Belajar huruf ' . $namaHuruf,
                'deskripsi' => 'Pengguna telah mempelajari dan memahami karakter huruf ' . $namaHuruf . ' dalam sistem penulisan Jepang.',
                'user_id' => $user->id,
                'total_exp' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            //tambah exp ke user
            $user->exp += 5;
            $user->save();  

            //cek apakah user level up
            $levelUp = $this->checkLevelUp($user);

            if ($levelUp) {
                // Get features unlocked for the new level
                $unlockedFeatures = $this->getUnlockedFeatures($user->level);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Level up!',
                    'data' => [
                        'newLevel' => $user->level,
                        'unlockedFeatures' => $unlockedFeatures
                    ]
                ]);
            }

            // Get current level data
            $currentLevel = $user->level;
            $currentExp = $user->exp;
            $nextLevelExp = config('exp.levels')[$currentLevel]['max_exp'] ?? null;

            return response()->json([
                'success' => true,
                'message' => 'exp anda bertambah 5 exp',
                'data' => [
                    'currentExp' => $currentExp,
                    'expGained' => 5,
                    'nextLevelExp' => $nextLevelExp
                ]
            ]);
        }
    }

    public static function checkLevelUp($user)
    {
        $levels = config('exp.levels');
        $currentLevel = $user->level;
        $currentExp = $user->exp;
    
        // Ambil level terakhir dari config
        $maxLevel = max(array_keys($levels));
    
        // Kalau sudah level maksimum, tidak naik level
        if ($currentLevel >= $maxLevel) {
            return false;
        }
    
        // Ambil batas exp level sekarang
        $currentMaxExp = $levels[$currentLevel]['max_exp'] ?? null;
    
        // Cek apakah user layak naik level
        if ($currentMaxExp !== null && $currentExp >= $currentMaxExp) {
            $nextLevel = $currentLevel + 1;
            $user->level = $nextLevel;
            $user->save();
    
            return true;
        }
    
        return false;
    }

    private function getUnlockedFeatures($level)
    {
        $features = [
            2 => [
                'Belajar Huruf Katakana',
                'Kuis Katakana'
            ],
            3 => [
                'Belajar Kosakata',
                'Kuis Kosakata'
            ]
        ];

        return $features[$level] ?? [];
    }

    public function updateUserHurufPaham(Request $request)
    {
        $user = Auth::user();

        $userHuruf = UserHuruf::where('user_id', $user->id)->where('huruf_id', $request->id_huruf)->first();

        $userHuruf->update(['is_learned' => false]);

        //check progress pembelajaran
        $existing = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

        //ambil data status pembelajaran
        $statusOld = $existing->status;

        //update progress pembelajaran
        DB::table('user_belajars')
            ->where('user_id', $user->id)
            ->where('pembelajaran_id', $request->pembelajaran_id)
            ->update(['progress' => $existing->progress - 1, 'updated_at' => now(),'last_completed_at' => null,'status' => 'belum selesai']);

        //ambil data user_belajar yang sudah di update progress
        $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();


        //ambil data yang sudah di update progress
        $dataUserBelajar = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', $request->pembelajaran_id)->first();

        //ambil data user_belajar jenis
        $dataUserBelajarJenis = DB::table('user_belajars')->where('user_id', $user->id)->where('pembelajaran_id', 'belajar-' . $request->jenis)->first();  
        
        if($statusOld == 'selesai' && $dataUserBelajar->status == 'belum selesai'){
            //update status menjadi belum selesai
            DB::table('user_belajars')
                ->where('user_id', $user->id)
                ->where('pembelajaran_id', 'belajar-' . $request->jenis)
                ->update(['status' => 'belum selesai', 'updated_at' => now(),'last_completed_at' => null,'progress' => $dataUserBelajarJenis->progress - 1]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Huruf berhasil dikembalikan ke belum paham',
        ]);

    }

    public function updateUserKosakata(Request $request)
    {
        $user = Auth::user();

        $userKosakata = DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->first();

        if($userKosakata && $userKosakata->is_learned){
            DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->update(['is_learned' => false,'last_completed_at' => null,'updated_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil dihapus dari daftar kosakata yang sudah di pelajari',
            ]);
        }else if($userKosakata && !$userKosakata->is_learned){
            DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->update(['is_learned' => true,'last_completed_at' => now(),'updated_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil ditambahkan ke daftar kosakata yang sudah di pelajari',
            ]);
        }else{
            $userKosakata = DB::table('user_kosakatas')->insert([
                'user_id' => $user->id,
                'kosakata_id' => $request->id,
                'is_learned' => true,
                'is_favorite' => false,
                'last_completed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil ditambahkan ke daftar kosakata yang sudah di pelajari',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kosakata berhasil diupdate',
        ]);
        
        
    }

    public function updateUserKosakataFavorite(Request $request)
    {
        $user = Auth::user();

        $userKosakata = DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->first();

        if($userKosakata && $userKosakata->is_favorite){
            DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->update(['is_favorite' => false,'updated_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil dihapus dari daftar kosakata favorit',
            ]);
        }else if($userKosakata && !$userKosakata->is_favorite){
            DB::table('user_kosakatas')->where('user_id', $user->id)->where('kosakata_id', $request->id)->update(['is_favorite' => true,'updated_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil ditambahkan ke daftar kosakata favorit',
            ]);
        }else{
            $userKosakata = DB::table('user_kosakatas')->insert([
                'user_id' => $user->id,
                'kosakata_id' => $request->id,
                'is_favorite' => true,
                'is_learned' => false,
                'last_completed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kosakata berhasil ditambahkan ke daftar kosakata favorit',
            ]);
        }

        
        
    }
}
