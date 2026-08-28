<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'credits',
        'semester',
        'topics',
    ];

    protected $casts = [
        'topics' => 'array',
    ];

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}