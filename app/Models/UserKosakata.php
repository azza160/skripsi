<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserHuruf extends Pivot
{
    protected $table = 'user_kosakatas';

    protected $fillable = [
        'user_id',
        'kosakata_id',
        'is_learned',
        'is_favorite',
        'last_completed_at',
    ];

    public $incrementing = true;

    protected $casts = [
        'is_learned' => 'boolean',
        'is_favorite' => 'boolean',
        'last_completed_at' => 'datetime',
    ];
}
