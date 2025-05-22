<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BentukKosakata extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'bentuk',
        'id_kosakata',
        'kanji',
        'furigana',
        'romaji',
        'arti',
        'deskripsi',
        'audio',
    ];

    public function kosakata()
    {
        return $this->belongsTo(Kosakata::class, 'id_kosakata');
    }

    public function contohKalimats()
    {
        return $this->hasMany(ContohKalimat::class, 'bentuk_kosakata_id');
    }
}
