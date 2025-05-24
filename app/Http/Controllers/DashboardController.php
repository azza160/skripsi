<?php

namespace App\Http\Controllers;

use App\Models\Huruf;
use App\Models\Kosakata;
use Inertia\Inertia;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
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

    public function DashboardUser()
    {
        $user = auth()->user();

        $hurufStats = $this->getHurufStats($user);
        $kosakataStats = $this->getKosakataStats($user);

        // mencari waktu terakhir belajar huruf dan kosa kata
        $lastCompletedAt = $user->hurufs()->wherePivot('is_learned', true)->orderBy('last_completed_at', 'desc')->first()?->pivot?->last_completed_at;
        $lastCompletedHumanReadable = $lastCompletedAt ? Carbon::parse($lastCompletedAt)->locale('id')->diffForHumans() : null;
        $lastCompletedAtKosakata = $user->kosakatas()->wherePivot('is_learned', true)->orderBy('last_completed_at', 'desc')->first()?->pivot?->last_completed_at;
        $lastCompletedHumanReadableKosakata = $lastCompletedAtKosakata ? Carbon::parse($lastCompletedAtKosakata)->locale('id')->diffForHumans() : null;

        //mencari progress pembelajaran
        $pembelajaranProgress = $user
            ->pembelajarans()
            ->orderBy('user_belajars.created_at', 'desc') // urutkan dari yang terbaru
            ->get()
               ->map(function ($pembelajaran) {
                return [
                    'id' => $pembelajaran->id,
                    'nama' => $pembelajaran->nama,
                    'desk' => $pembelajaran->desk,
                    'tipe' => $pembelajaran->tipe,
                    'max' => $pembelajaran->max,
                    'jenis' => $pembelajaran->jenis,
                    'progress' => $pembelajaran->pivot->progress ?? 0,
                    'status' => $pembelajaran->pivot->status ?? 'belum selesai',
                    'last_completed_at' => $pembelajaran->pivot->last_completed_at ? Carbon\Carbon::parse($pembelajaran->pivot->last_completed_at)->locale('id')->diffForHumans() : null,
                    'route_name' => $pembelajaran->route_name,
                    'route_params' => $pembelajaran->route_params,
                ];
            });

        return Inertia::render('User/Dashboard', [
            'user' => $user,
            'currentLevel' => $user->level,
            'currentExp' => $user->exp,
            'maxExp' => $this->calculateNextLevelExp($user->level),
            'pembelajaranProgress' => $pembelajaranProgress,
            ...$hurufStats,
            ...$kosakataStats,
            'showWelcomeAlert' => session('show_welcome_alert', false),
            'lastCompletedHumanReadable' => $lastCompletedHumanReadable,
            'lastCompletedHumanReadableKosakata' => $lastCompletedHumanReadableKosakata,
        ]);
    }

    private function getHurufStats($user)
    {
        return [
            'jumlahHuruf' => $user->hurufs()->wherePivot('is_learned', true)->count(),
            'jumlahHurufHariIni' => $user
                ->hurufs()
                ->wherePivot('is_learned', true)
                ->whereDate('last_completed_at', now()->today())
                ->count(),
            'hiraganaProgress' => $user->hurufs()->wherePivot('is_learned', true)->where('jenis_huruf', 'hiragana')->count(),
            'katakanaProgress' => $user->hurufs()->wherePivot('is_learned', true)->where('jenis_huruf', 'katakana')->count(),
            'maxHiragana' => Huruf::where('jenis_huruf', 'hiragana')->count(),
            'maxKatakana' => Huruf::where('jenis_huruf', 'katakana')->count(),
        ];
    }

    private function getKosakataStats($user)
    {
        return [
            'jumlahKosakata' => $user->kosakatas()->wherePivot('is_learned', true)->count(),
            'jumlahKosakataHariIni' => $user
                ->kosakatas()
                ->wherePivot('is_learned', true)
                ->whereDate('last_completed_at', now()->today())
                ->count(),
            'maxKosakata' => Kosakata::count(),
            'kosakataFavorit' => $user->kosakatas()->wherePivot('is_favorite', true)->count(),
        ];
    }
}
