<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserBelajar extends Pivot
{
    protected $table = 'user_belajars';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'pembelajaran_id'];
    
    
    protected $fillable = [
        'user_id',
        'pembelajaran_id',
        'progress',
        'status',
        'last_completed_at',
    ];

    protected $dates = ['last_completed_at'];

    
}
