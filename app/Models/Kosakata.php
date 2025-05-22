<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kosakata extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'kanji',
        'furigana',
        'romaji',
        'arti',
        'deskripsi',
        'catatan',
        'audio',
    ];


    public function bentukKosakatas()
    {
        return $this->hasMany(BentukKosakata::class, 'id_kosakata');
    }

    public function contohKalimats()
    {
        return $this->hasMany(ContohKalimat::class, 'kosakata_id');
    }

    public function userKosakatas()
    {
        return $this->belongsToMany(User::class, 'user_kosakatas', 'kosakata_id', 'user_id')
            ->withPivot('is_learned', 'last_completed_at')
            ->withTimestamps();
    }
}
