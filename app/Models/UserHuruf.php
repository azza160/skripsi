<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserHuruf extends Pivot
{
    protected $table = 'user_hurufs';

    protected $fillable = [
        'user_id',
        'huruf_id',
        'is_learned',
        'last_completed_at',
    ];

    public $incrementing = true;

    protected $casts = [
        'is_learned' => 'boolean',
        'last_completed_at' => 'datetime',
    ];
}
