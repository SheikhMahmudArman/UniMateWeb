<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    public function run()
    {
        $semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

        foreach ($semesters as $code) {
            Semester::create([
                'code' => $code,
                'name' => "Semester {$code}",
                'is_active' => $code === '1.1',
            ]);
        }
    }
}