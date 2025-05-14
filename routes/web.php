<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HurufController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::get('auth/google', [AuthController::class, 'redirectToGoogle'])->name('google.login');
    Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

// User routes
// Route::middleware(['auth', 'role:pengguna'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');

    Route::get('/dashboard/huruf', function () {
        return Inertia::render('User/Huruf');
    })->name('huruf');

    Route::get('/dashboard/huruf/kategori-hiragana', function () {
        return Inertia::render('User/Kategori-Hiragana');
    })->name('kategori-huruf-hiragana');

    Route::get('/dashboard/huruf/kategori-katakana', function () {
        return Inertia::render('User/Kategori-Katakana');
    })->name('kategori-huruf-katakana');

    Route::get('/dashboard/huruf/{jenis}/{kategori}',[HurufController::class,'GetHurufByKategori'])->name('huruf-list');

    Route::get('/dashboard/huruf/{jenis}/{kategori}/{id}', [HurufController::class, 'showDetailHuruf'])->name('huruf-hiragana-detail');

    Route::get('/dashboard/kosakata', function () {
        return Inertia::render('User/List-Kosakata');
    })->name('list-kosakata');


    Route::get('/dashboard/kosakata/flashcard', function () {
        return Inertia::render('User/Flashcard');
    })->name('kosakata-flashcard');
// });

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');



