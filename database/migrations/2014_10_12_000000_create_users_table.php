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
            $table->integer('exp')->default(0);
            $table->unsignedBigInteger('level_id')->default(1);
            $table->enum('peran', ['admin', 'pengguna'])->default('pengguna');
            $table->string('foto')->nullable();
            $table->timestamps();

            $table->foreign('level_id')->references('id')->on('levels')->onDelete('cascade');
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
