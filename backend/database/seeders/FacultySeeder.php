<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run()
    {
        Faculty::create([
            'name' => 'Dr. Ahmed Hasan',
            'department' => 'CSE',
            'designation' => 'Professor & Head',
            'email' => 'ahmed.hasan@austmate.edu',
            'room' => 'Room 401',
            'consultation_hours' => 'Mon/Wed 2:00 PM – 4:00 PM',
        ]);

        Faculty::create([
            'name' => 'Dr. Fatima Rahman',
            'department' => 'CSE',
            'designation' => 'Associate Professor',
            'email' => 'fatima.rahman@austmate.edu',
            'room' => 'Room 402',
            'consultation_hours' => 'Tue/Thu 10:00 AM – 12:00 PM',
        ]);
    }
}