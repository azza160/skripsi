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
        Schema::create('contoh__penggunaans', function (Blueprint $table) {
            $table->id();
            $table->string('kata');
            $table->string('romaji');
            $table->string('arti');
            $table->string('huruf_id');
            $table->foreign('huruf_id')->references('id')->on('hurufs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contoh__penggunaans');
    }
};
