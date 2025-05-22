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
        Schema::create('contoh_kalimats', function (Blueprint $table) {
            $table->id();
            $table->string('kosakata_id')->nullable();
            $table->string('bentuk_kosakata_id')->nullable();
            $table->string('kanji')->nullable();
            $table->string('furigana')->nullable();
            $table->string('romaji');
            $table->string('arti');
            $table->string('audio')->nullable();
            $table->timestamps();
            $table->foreign('kosakata_id')->references('id')->on('kosakatas')->onDelete('cascade');
            $table->foreign('bentuk_kosakata_id')->references('id')->on('bentuk_kosakatas')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contoh_kalimats');
    }
};
