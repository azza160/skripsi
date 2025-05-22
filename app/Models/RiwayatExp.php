<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatExp extends Model
{
    use HasFactory;

    protected $table = 'riwayat_exp';

    protected $fillable = [
        'user_id',
        'nama',
        'deskripsi',
        'huruf_id',
        'quis_id',
        'total_exp',
    ];

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional: kalau kamu punya model Huruf
    public function huruf()
    {
        return $this->belongsTo(Huruf::class, 'huruf_id');
    }

    
}
