<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Cek status user
            $user = User::where('email', $credentials['email'])->first();
            if ($user && $user->status === 'pending') {
                return back()->with([
                    'success' => false,
                    'message' => 'Akun Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi.'
                ]);
            }

            if (Auth::attempt($credentials)) {
                $today = Carbon::today();
                $user = Auth::user();

                // Set session flag untuk welcome alert
                session()->flash('show_welcome_alert', true);

                if ($user->last_login_date === $today) {
                    $user->login_streak++;
                } else {
                    $user->login_streak = 1;
                }

                $user->last_login_date = $today;
                if ($user->peran === 'admin') {
                    return redirect()->intended('/admin/dashboard')->with([
                        'success' => true,
                        'message' => 'Selamat datang kembali, Admin!'
                    ]);
                } else {
                    //check login streak
                    if(!$user->last_login_date){
                        //pertama kali login
                        $user->login_streak = 1;
                    }else{
                        $lastLogin = Carbon::parse($user->last_login_date);
                        if($lastLogin->isYesterday()){
                            $user->login_streak += 1;
                        }elseif($lastLogin->isToday()){
                            //sudah login hari ini,tidak perlu diupdate
                        }else{
                            //login sebelumnya bukan hari ini,reset streak
                            $user->login_streak = 1;
                        }
                    }

                    $user->last_login_date = $today;
                    $user->save();

                    return redirect()->intended('/dashboard')->with([
                        'success' => true,
                        'message' => 'Selamat datang kembali!'
                    ]);
                }
            }

            return back()->with([
                'success' => false,
                'message' => 'Email atau password salah.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error saat login: ' . $e->getMessage());
            return back()->with([
                'success' => false,
                'message' => 'Terjadi kesalahan saat login.'
            ]);
        }
    }

    public function register(Request $request)
    {
        try {
            // Cek apakah email sudah terdaftar
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                if ($existingUser->status === 'pending') {
                    return back()->with([
                        'success' => false,
                        'message' => 'Email ini sudah terdaftar dan menunggu verifikasi. Silakan cek email Anda.',
                        'alertType' => 'warning'
                    ]);
                } else {
                    return back()->with([
                        'success' => false,
                        'message' => 'Email ini sudah terdaftar. Silakan login.',
                        'alertType' => 'warning'
                    ]);
                }
            }

            // Validasi data
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'nama_pengguna' => 'required|string|max:255',
                'nama_lengkap' => 'required|string|max:255',
                'password' => 'required|confirmed|min:6',
            ]);
        
            // Simpan data user
            $user = User::create([
                'email' => $request->email,
                'nama_pengguna' => $request->nama_pengguna,
                'nama_lengkap' => $request->nama_lengkap,
                'password' => bcrypt($request->password),
                'status' => 'pending',
            ]);
          
            // Generate verification URL dengan expired time 24 jam
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addHours(24),
                ['id' => $user->id, 'hash' => sha1($user->email)]
            );
        
            // Kirim email verifikasi
            Mail::to($user->email)->send(new VerifyEmail($user, $verificationUrl));
        
            return back()->with([
                'success' => true,
                'message' => 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error saat registrasi: ' . $e->getMessage());
            return back()->with([
                'success' => false,
                'message' => 'Terjadi kesalahan saat registrasi: ' . $e->getMessage()
            ]);
        }
    }

    public function logout(Request $request)
    {
        // Hapus session flag welcome alert
        session()->forget('show_welcome_alert');
       
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
                    'status' => 'aktif',
                    'foto' => $googleUser->avatar,
                    'email_verified_at' => now(),
                ]);

                Auth::login($user);
                // Set session flag untuk welcome alert
                session()->flash('show_welcome_alert', true);

                //check login streak
                $today = Carbon::today();
               
                // Set streak ke 1 untuk login pertama kali
                $user->login_streak = 1;
                $user->last_login_date = $today;
                $user->save();
                
                return redirect()->intended('/dashboard')->with([
                    'success' => true,
                    'message' => 'Login dengan Google berhasil!'
                ]);
            } 
            
            // Jika user ditemukan
            if ($user->password && !$user->google_id) {
                return redirect()->route('login')->with([
                    'success' => false,
                    'message' => 'Akun ini sudah terdaftar dengan email dan password. Silakan login menggunakan email dan password Anda.',
                    'alertType' => 'warning'
                ]);
            }

            if ($user->status === 'pending') {
                return redirect()->route('login')->with([
                    'success' => false,
                    'message' => 'Akun Anda belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.',
                    'alertType' => 'warning'
                ]);
            }
            
            // Update data google jika user sebelumnya login dengan google
            $user->update([
                'google_id' => $googleUser->id,
                'foto' => $googleUser->avatar,
            ]);

            Auth::login($user);

            // Set session flag untuk welcome alert
            session()->flash('show_welcome_alert', true);

            // Update login streak untuk user yang sudah ada
            $today = Carbon::today();
            if (!$user->last_login_date) {
                // Pertama kali login
                $user->login_streak = 1;
            } else {
                $lastLogin = Carbon::parse($user->last_login_date);
                if ($lastLogin->isYesterday()) {
                    $user->login_streak += 1;
                } elseif (!$lastLogin->isToday()) {
                    // Login sebelumnya bukan hari ini, reset streak
                    $user->login_streak = 1;
                }
            }
            $user->last_login_date = $today;
            $user->save();

            if ($user->peran === 'admin') {
                return redirect()->intended('/admin/dashboard')->with([
                    'success' => true,
                    'message' => 'Selamat datang kembali, Admin!'
                ]);
            }

            return redirect()->intended('/dashboard')->with([
                'success' => true,
                'message' => 'Login dengan Google berhasil!'
            ]);

        } catch (\Exception $e) {
            Log::error('Error saat login dengan Google: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->route('login')->with([
                'success' => false,
                'message' => 'Terjadi kesalahan saat login dengan Google: ' . $e->getMessage(),
                'alertType' => 'error'
            ]);
        }
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        try {
            $user = User::findOrFail($id);

            if (!hash_equals((string) $hash, sha1($user->email))) {
                return Inertia::render('Auth/VerificationExpired', [
                    'message' => 'Link verifikasi tidak valid.'
                ]);
            }

            if ($user->status === 'aktif') {
                return redirect()->route('login')->with([
                    'success' => true,
                    'message' => 'Email sudah diverifikasi sebelumnya. Silakan login.'
                ]);
            }

            // Update user status dan email_verified_at
            $user->status = 'aktif';
            $user->email_verified_at = now();
            $user->save();

            return redirect()->route('login')->with([
                'success' => true,
                'message' => 'Email berhasil diverifikasi! Silakan login.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error saat verifikasi email: ' . $e->getMessage());
            return Inertia::render('Auth/VerificationExpired', [
                'message' => 'Terjadi kesalahan saat verifikasi email.'
            ]);
        }
    }
} 