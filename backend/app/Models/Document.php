<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'semester',
        'url',
        'file_path',
        'course_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}