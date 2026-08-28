<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            SemesterSeeder::class,
            CourseSeeder::class,
            StudentSeeder::class,
            FacultySeeder::class,
            DocumentSeeder::class,
            MarkSeeder::class,
            NoticeSeeder::class,
            AttendanceSeeder::class,
            LibrarySeeder::class,
            RoutineSeeder::class,
        ]);
    }
}