<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HurufController;
use App\Http\Controllers\KosakataController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserBelajarController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
   return Inertia::render('Welcome');
});

// Auth routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');

    // Email verification route
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

// User routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard',[DashboardController::class,"dashboardUser"])->name('dashboard');

    Route::get('/dashboard/huruf', [HurufController::class,"pilihHuruf"])->name('huruf');

    Route::get('/dashboard/huruf/kategori-hiragana', [HurufController::class,"kategoriHiragana"])->name('kategori-huruf-hiragana');

    Route::get('/dashboard/huruf/kategori-katakana',[HurufController::class,"kategoriKatakana"])->name('kategori-huruf-katakana');

    Route::get('/dashboard/huruf/{jenis}/{kategori}',[HurufController::class,'GetHurufByKategori'])->name('huruf-list');

    Route::get('/dashboard/huruf/{jenis}/{kategori}/{id}', [HurufController::class, 'showDetailHuruf'])->name('huruf-hiragana-detail');

    Route::get('/dashboard/kosakata',[KosakataController::class,'getAllKosakata'])->name('list-kosakata');

    Route::get('/dashboard/kosakata/detail-kosakata/{id}', [KosakataController::class,"getDetailKosakata"])->name('detail-kosakata');
    
    Route::get('/dashboard/flashcard', [KosakataController::class,'flashcard'])->name('flashcard');

    Route::post('/user/belajar/update', [UserBelajarController::class, 'updateProgress'])->name('user.belajar.update');
    Route::post('/user/belajar/update-huruf', [UserBelajarController::class, 'updateProgressHuruf'])->name('user.belajar.update-huruf');
    Route::get('/user/belajar/check', [UserBelajarController::class, 'checkLearningRecord'])->name('user.belajar.check');
    Route::post('/user/belajar/update-kategori', [UserBelajarController::class, 'updateProgressKategori'])->name('user.belajar.update-kategori');
    Route::post('/user/belajar/check-kategori', [UserBelajarController::class, 'checkKategoriRecord'])->name('user.belajar.check-kategori');
    Route::post('/user/belajar/update-user-huruf', [UserBelajarController::class, 'updateUserHuruf'])->name('user.belajar.update-user-huruf');
    Route::post('/user/belajar/update-user-huruf-paham', [UserBelajarController::class, 'updateUserHurufPaham'])->name('user.belajar.update-user-huruf-paham');
    Route::post('/user/belajar/update-user-kosakata', [UserBelajarController::class, 'updateUserKosakata'])->name('user.belajar.update-user-kosakata');
    Route::post('/user/belajar/update-user-kosakata-favorite', [UserBelajarController::class, 'updateUserKosakataFavorite'])->name('user.belajar.update-user-kosakata-favorite');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');




