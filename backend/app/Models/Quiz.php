<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'date', 'time', 'room', 'total_marks'];

    public function course() { return $this->belongsTo(Course::class); }
}
