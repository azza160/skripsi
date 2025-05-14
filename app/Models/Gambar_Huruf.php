<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gambar_Huruf extends Model
{
    use HasFactory;
    protected $fillable = [
        'link',
        'urutan',
        'huruf_id',
    ];

    // Relasi ke huruf
    public function huruf()
    {
        return $this->belongsTo(Huruf::class);
    }
}
