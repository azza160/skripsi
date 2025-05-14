<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            $request->session()->regenerate();
            $user = Auth::user();
            if ($user->peran === 'admin') {
                return redirect()->intended('/admin/dashboard');
            } else {
                return redirect()->intended('/dashboard');
            }
        }
        return back()->with([
            'success' => false,
            'message' => 'Email atau kata sandi salah.',
        ]);
    }

    public function register(Request $request)
    {
        
        $request->validate([
            'nama_pengguna' => 'required|string|min:4|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'nama_pengguna' => $request->nama_pengguna,
            'nama_lengkap' => '', // bisa diisi nanti
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'level_id' => 1,
            'peran' => 'pengguna',
        ]);
        
        return redirect()->route('login')->with([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan login untuk melanjutkan.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login')->with([
            'success' => true,
            'message' => 'Berhasil logout!',
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
{
    try {
        $googleUser = Socialite::driver('google')->user();
        
        // Cari user berdasarkan email
        $user = User::where('email', $googleUser->email)->first();
        
        // Jika user tidak ditemukan, buat baru
        if (!$user) {
            $user = User::create([
                'nama_pengguna' => $googleUser->name,
                'nama_lengkap' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => Hash::make(uniqid()),
                'peran' => 'pengguna',
                'foto' => $googleUser->avatar,
            ]);
        } 
        // Jika user ditemukan
        else {
            // Cek jika user sudah register manual (punya password tapi tidak punya google_id)
            if ($user->password && !$user->google_id) {
                return redirect()->route('login')->with([
                    'success' => false,
                    'message' => 'Akun ini sudah terdaftar. Silakan login menggunakan email dan password Anda.'
                ]);
            }
            
            // Update data google jika user sebelumnya login dengan google
            $user->update([
                'google_id' => $googleUser->id,
                'foto' => $googleUser->avatar,
            ]);
        }

        Auth::login($user);

        return redirect()->intended('/dashboard')->with([
            'success' => true,
            'message' => 'Login berhasil!'
        ]);

    } catch (\Exception $e) {
        return redirect()->route('login')->with([
            'success' => false,
            'message' => 'Terjadi kesalahan saat login dengan Google.'
        ]);
    }
}
} 