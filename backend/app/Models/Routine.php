<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Routine extends Model
{
    use HasFactory;

    protected $fillable = [
        'time',
        'course_code',
        'course_name',
        'room',
        'day',
        'notify',
    ];
}