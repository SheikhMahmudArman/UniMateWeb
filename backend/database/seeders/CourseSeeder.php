<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [

            // ==========================================
            // YEAR 1 - SEMESTER 1 (1.1)
            // ==========================================

            [
                'code' => 'HUM1107',
                'name' => 'Critical Thinking and Communication',
                'credits' => 3,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'HUM1108',
                'name' => 'English Language Sessional',
                'credits' => 1.5,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],

            [
                'code' => 'MATH1115',
                'name' => 'Mathematics-I',
                'credits' => 3,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'PHY1115',
                'name' => 'Physics',
                'credits' => 3,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'PHY1116',
                'name' => 'Physics Lab',
                'credits' => 0.75,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],

            [
                'code' => 'CHEM1115',
                'name' => 'Chemistry',
                'credits' => 3,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1101',
                'name' => 'Elementary Structured Programming',
                'credits' => 3,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1102',
                'name' => 'Elementary Structured Programming Lab',
                'credits' => 1.5,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1108',
                'name' => 'Introduction to Computer Systems',
                'credits' => 1.5,
                'semester' => '1.1',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],


            // ==========================================
            // YEAR 1 - SEMESTER 2 (1.2)
            // ==========================================

            [
                'code' => 'MATH1219',
                'name' => 'Mathematics-II',
                'credits' => 3,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => 'MATH1115'
            ],

            [
                'code' => 'ME1211',
                'name' => 'Basic Mechanical Engineering',
                'credits' => 3,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'ME1214',
                'name' => 'Engineering Drawing',
                'credits' => 0.75,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '0-3/2',
                'prerequisite' => null
            ],

            [
                'code' => 'EEE1241',
                'name' => 'Basic Electrical Engineering',
                'credits' => 3,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'EEE1242',
                'name' => 'Basic Electrical Engineering Lab',
                'credits' => 1.5,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1200',
                'name' => 'Software Development-I',
                'credits' => 1.5,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1203',
                'name' => 'Discrete Mathematics',
                'credits' => 3,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => null
            ],

            [
                'code' => 'CSE1205',
                'name' => 'Object Oriented Programming',
                'credits' => 3,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '3-0',
                'prerequisite' => 'CSE1101'
            ],

            [
                'code' => 'CSE1206',
                'name' => 'Object Oriented Programming Lab',
                'credits' => 1.5,
                'semester' => '1.2',
                'topics' => [],
                'hours_per_week' => '0-3',
                'prerequisite' => null
            ],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(
                ['code' => $course['code']],
                $course
            );
        }
    }
}