<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('nama_pengguna');
            $table->string('nama_lengkap');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('google_id')->nullable();
            $table->unsignedInteger('exp')->default(0);
            $table->unsignedInteger('level')->default(1);
            $table->enum('status', ['pending', 'aktif'])->default('pending'); // ✅ kolom baru
            $table->enum('peran', ['admin', 'pengguna'])->default('pengguna');
            $table->date('last_login_date')->nullable();
            $table->unsignedInteger('login_streak')->default(0);
            $table->string('foto')->nullable();
            $table->timestamp('email_verified_at')->nullable(); // ✅ waktu verifikasi email
            $table->string('verification_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
