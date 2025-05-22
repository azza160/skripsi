<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['nama_pengguna', 'nama_lengkap', 'email', 'password', 'google_id', 'exp', 'level', 'peran', 'foto','status','email_verified_at','verification_token','last_login_date','login_streak'];

    protected $hidden = ['password'];

    

    public function pembelajarans()
{
    return $this->belongsToMany(Pembelajaran::class, 'user_belajars')
        ->withPivot(['progress', 'status', 'last_completed_at'])
        ->withTimestamps();
}

public function hurufs()
{
    return $this->belongsToMany(Huruf::class, 'user_hurufs')
        ->withPivot('is_learned')
        ->withTimestamps();
}

public function kosakatas()
{
    return $this->belongsToMany(Kosakata::class, 'user_kosakatas', 'user_id', 'kosakata_id')
                ->withPivot('is_learned', 'is_favorite', 'last_completed_at')
                ->withTimestamps();
}

public function riwayatExp()
{
    return $this->hasMany(RiwayatExp::class);
}

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::ulid();
            }
        });
    }
}
