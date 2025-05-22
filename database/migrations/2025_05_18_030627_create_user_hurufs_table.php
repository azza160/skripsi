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
        Schema::create('user_hurufs', function (Blueprint $table) {
            $table->id();
            $table->ulid('user_id');
            $table->string('huruf_id');
            $table->boolean('is_learned')->default(false);
            $table->timestamp('last_completed_at')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('huruf_id')->references('id')->on('hurufs')->onDelete('cascade');
            $table->unique(['user_id', 'huruf_id']); // Biar gak dobel
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_hurufs');
    }
};
