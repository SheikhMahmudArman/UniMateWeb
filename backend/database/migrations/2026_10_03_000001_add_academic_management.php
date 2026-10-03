<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('semesters', function (Blueprint $table) {
            $table->string('drive_url', 2048)->nullable();
        });
        Schema::table('routines', function (Blueprint $table) {
            $table->string('semester')->nullable()->index();
        });
        // Preserve existing records; infer a semester only from a matching course.
        foreach (DB::table('routines')->get() as $routine) {
            $semester = DB::table('courses')->where('code', $routine->course_code)->value('semester');
            DB::table('routines')->where('id', $routine->id)->update(['semester' => $semester]);
        }
        foreach (['quizzes', 'assignments'] as $name) {
            Schema::create($name, function (Blueprint $table) use ($name) {
                $table->id();
                $table->foreignId('course_id')->constrained()->cascadeOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->date($name === 'quizzes' ? 'date' : 'due_date')->index();
                $table->unsignedInteger('total_marks')->default(10);
                if ($name === 'quizzes') {
                    $table->time('time')->nullable();
                    $table->string('room')->nullable();
                } else {
                    $table->string('file_path')->nullable();
                    $table->string('file_name')->nullable();
                }
                $table->timestamps();
            });
        }
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('order')->default(1);
            $table->timestamps();
        });
        foreach (['topic', 'assignment'] as $resource) {
            Schema::create($resource.'_user', function (Blueprint $table) use ($resource) {
                $table->foreignId($resource.'_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->primary([$resource.'_id', 'user_id']);
            });
        }
        foreach (DB::table('courses')->get() as $course) {
            foreach (json_decode($course->topics ?? '[]', true) ?? [] as $index => $title) {
                if (is_string($title)) {
                    DB::table('topics')->insert(['course_id' => $course->id, 'title' => $title,
                        'order' => $index + 1, 'created_at' => now(), 'updated_at' => now()]);
                }
            }
        }
        // Existing folders must remain discoverable even on installations without seed data.
        $codes = collect(['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'])
            ->merge(DB::table('courses')->pluck('semester'))
            ->merge(DB::table('documents')->pluck('semester'))
            ->merge(DB::table('students')->pluck('semester'))->filter()->unique();
        foreach ($codes as $code) {
            DB::table('semesters')->insertOrIgnore(['code' => $code, 'name' => 'Semester '.$code,
                'is_active' => false, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('topic_user');
        Schema::dropIfExists('assignment_user');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('quizzes');
        Schema::table('routines', function (Blueprint $table) {
            $table->dropIndex(['semester']);
            $table->dropColumn('semester');
        });
        Schema::table('semesters', fn (Blueprint $table) => $table->dropColumn('drive_url'));
    }
};
