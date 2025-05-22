<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContohKalimat extends Model
{
    use HasFactory;

    protected $fillable = [
        'kosakata_id',
        'bentuk_kosakata_id',
        'kanji',
        'furigana',
        'romaji',
        'arti',
        'audio',
    ];

    public function kosakata()
    {
        return $this->belongsTo(Kosakata::class, 'kosakata_id');
    }

    public function bentukKosakata()
    {
        return $this->belongsTo(BentukKosakata::class, 'bentuk_kosakata_id');
    }
}
