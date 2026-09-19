<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('semester');
            $table->integer('quiz')->default(0);
            $table->integer('mid')->default(0);
            $table->integer('online')->default(0);
            $table->integer('final')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('marks');
    }
};