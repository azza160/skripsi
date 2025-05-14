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
        Schema::create('hurufs', function (Blueprint $table) {
            $table->string('id')->primary();  // id jadi string
            $table->string('huruf');
            $table->enum('jenis_huruf', ['hiragana', 'katakana']);
            $table->enum('kategori_huruf', ['gojuon', 'dakuten', 'handakuten', 'youon', 'sokuon', 'choon']);
            $table->text('deskripsi')->nullable();
            $table->string('romaji');
            $table->unsignedTinyInteger('jumlah_coretan')->nullable();
            $table->string('kategori')->nullable(); // Contoh: vokal, non vokal
            $table->string('groups')->nullable(); // 'a','ka','sa','ta',dll
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hurufs');
    }
};
