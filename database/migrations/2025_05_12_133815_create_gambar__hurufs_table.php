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
        Schema::create('gambar__hurufs', function (Blueprint $table) {
            $table->id();
            $table->string('link');
            $table->unsignedTinyInteger('urutan'); // 1, 2, 3...
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
        Schema::dropIfExists('gambar__hurufs');
    }
};
