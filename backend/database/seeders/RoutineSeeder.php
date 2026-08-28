<?php

namespace Database\Seeders;

use App\Models\Routine;
use Illuminate\Database\Seeder;

class RoutineSeeder extends Seeder
{
    public function run()
    {
        $routines = [
            ['time' => '9:00 AM', 'course_code' => 'CSE 2103', 'course_name' => 'Data Structures', 'room' => 'Room 301', 'day' => 'Monday', 'notify' => false],
            ['time' => '11:00 AM', 'course_code' => 'CSE 2105', 'course_name' => 'Algorithms', 'room' => 'Room 302', 'day' => 'Monday', 'notify' => false],
            ['time' => '9:00 AM', 'course_code' => 'CSE 2107', 'course_name' => 'Database Systems', 'room' => 'Room 303', 'day' => 'Tuesday', 'notify' => false],
            ['time' => '2:00 PM', 'course_code' => 'CSE 2103', 'course_name' => 'Data Structures', 'room' => 'Room 301', 'day' => 'Wednesday', 'notify' => false],
            ['time' => '11:00 AM', 'course_code' => 'CSE 2105', 'course_name' => 'Algorithms', 'room' => 'Room 302', 'day' => 'Thursday', 'notify' => false],
        ];

        foreach ($routines as $routine) {
            Routine::create($routine);
        }
    }
}