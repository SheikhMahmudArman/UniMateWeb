<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('routines', function (Blueprint $table) {
            $table->id();
            $table->string('time');
            $table->string('course_code');
            $table->string('course_name');
            $table->string('room');
            $table->string('day');
            $table->boolean('notify')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('routines');
    }
};