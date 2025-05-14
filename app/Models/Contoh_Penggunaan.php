<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contoh_Penggunaan extends Model
{
    use HasFactory;

    protected $fillable = [
        'kata',
        'romaji',
        'arti',
        'huruf_id',
    ];

    // Relasi ke huruf
    public function huruf()
    {
        return $this->belongsTo(Huruf::class);
    }
}
