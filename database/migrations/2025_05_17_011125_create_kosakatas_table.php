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
        Schema::create('kosakatas', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kanji')->nullable();
            $table->string('furigana')->nullable();
            $table->string('romaji');
            $table->string('arti');
            $table->text('deskripsi')->nullable();
            $table->text('catatan')->nullable();
            $table->string('audio')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kosakatas');
    }
};
