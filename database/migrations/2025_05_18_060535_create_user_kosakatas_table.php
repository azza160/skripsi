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
        Schema::create('user_kosakatas', function (Blueprint $table) {
            $table->id();
            $table->ulid('user_id');
            $table->string('kosakata_id');
            $table->boolean('is_learned')->default(false);
            $table->boolean('is_favorite')->default(false);
            $table->timestamp('last_completed_at')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kosakata_id')->references('id')->on('kosakatas')->onDelete('cascade');
            $table->unique(['user_id', 'kosakata_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_kosakatas');
    }
};
