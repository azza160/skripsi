<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audio extends Model
{
    use HasFactory;

    protected $guarded = ['id'] ;

     // Relasi dengan tabel Huruf
     public function huruf()
     {
         return $this->belongsTo(Huruf::class);
     }
}
