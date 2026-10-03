<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'due_date', 'total_marks', 'file_path', 'file_name'];

    protected $hidden = ['file_path'];

    public function course() { return $this->belongsTo(Course::class); }
    public function completedBy() { return $this->belongsToMany(User::class); }
}
