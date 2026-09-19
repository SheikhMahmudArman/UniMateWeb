<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@austmate.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'student_id' => 'ADMIN-001',
        ]);

        User::create([
            'name' => 'Student User',
            'email' => 'student@austmate.com',
            'password' => Hash::make('student123'),
            'role' => 'student',
            'student_id' => '2023-12345',
        ]);
    }
}