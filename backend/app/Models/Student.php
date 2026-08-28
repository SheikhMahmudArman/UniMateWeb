<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'email',
        'semester',
        'cgpa',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}