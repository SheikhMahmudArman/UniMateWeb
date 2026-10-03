<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'order'];

    public function course() { return $this->belongsTo(Course::class); }
    public function completedBy() { return $this->belongsToMany(User::class); }
}
