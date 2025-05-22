<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembelajaran extends Model
{
    use HasFactory;

    protected $keyType = 'string';      // primary key bertipe string
    public $incrementing = false;    
    
    protected $fillable = [
        'nama',
        'desk',
        'max',
        'tipe',
        'route_name',
        'route_params',
    ];

    protected $casts = [
        'route_params' => 'array',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_belajars')
            ->withPivot(['progress', 'status', 'last_completed_at'])
            ->withTimestamps();
    }
}
