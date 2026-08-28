<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            ['code' => 'CSE 1101', 'name' => 'Intro to Programming', 'credits' => 3, 'semester' => '1.1', 'topics' => ['Introduction', 'Variables', 'Loops', 'Functions', 'Arrays']],
            ['code' => 'CSE 1103', 'name' => 'Discrete Math', 'credits' => 3, 'semester' => '1.1', 'topics' => ['Set Theory', 'Logic', 'Combinatorics', 'Graph Theory']],
            ['code' => 'CSE 1201', 'name' => 'OOP', 'credits' => 3, 'semester' => '1.2', 'topics' => ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation']],
            ['code' => 'CSE 2103', 'name' => 'Data Structures', 'credits' => 3, 'semester' => '2.1', 'topics' => ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs']],
            ['code' => 'CSE 2105', 'name' => 'Algorithms', 'credits' => 3, 'semester' => '2.1', 'topics' => ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Graph Algorithms']],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}