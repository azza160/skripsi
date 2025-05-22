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
        Schema::create('user_belajars', function (Blueprint $table) {
            $table->string('user_id', 26);
            $table->string('pembelajaran_id');
            $table->integer('progress')->default(0);
            $table->enum('status', ['belum selesai', 'selesai'])->default('belum selesai');
            $table->timestamp('last_completed_at')->nullable();
            $table->timestamps();   
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pembelajaran_id')->references('id')->on('pembelajarans')->onDelete('cascade');
            $table->primary(['user_id', 'pembelajaran_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_belajars');
    }
};
