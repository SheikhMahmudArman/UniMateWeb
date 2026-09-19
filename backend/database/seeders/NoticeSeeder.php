<?php

namespace Database\Seeders;

use App\Models\Notice;
use Illuminate\Database\Seeder;

class NoticeSeeder extends Seeder
{
    public function run()
    {
        Notice::create([
            'title' => 'Midterm Exam Schedule',
            'content' => 'Midterm exams will start from 15th August. Please check the detailed schedule on the notice board.',
            'date' => '2026-08-10',
            'type' => 'exam',
            'is_published' => true,
        ]);

        Notice::create([
            'title' => 'Library Renovation',
            'content' => 'The library will remain closed from 20th to 25th August for renovation.',
            'date' => '2026-08-08',
            'type' => 'general',
            'is_published' => true,
        ]);
    }
}