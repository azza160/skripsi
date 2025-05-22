<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Huruf extends Model
{
    use HasFactory;
    public $incrementing = false; // karena id manual dan tipe string
    protected $keyType = 'string'; // ubah key type ke string

    protected $fillable = ['id', 'huruf', 'jenis_huruf', 'kategori_huruf', 'deskripsi', 'romaji', 'jumlah_coretan', 'kategori', 'catatan', 'groups','audio'];

    // Relasi ke contoh penggunaan
    public function contohPenggunaans()
    {
        return $this->hasMany(Contoh_Penggunaan::class);
    }

    public function users()
{
    return $this->belongsToMany(User::class, 'user_hurufs', 'huruf_id', 'user_id')
                ->withPivot('is_learned', 'last_completed_at')
                ->withTimestamps();
}

    // Relasi ke gambar huruf
    public function gambarHurufs()
    {
        return $this->hasMany(Gambar_Huruf::class);
    }

 
}
