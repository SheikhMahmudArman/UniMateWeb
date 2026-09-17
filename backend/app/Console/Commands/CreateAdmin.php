<?php
namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class CreateAdmin extends Command
{
    protected $signature = 'unimate:admin';
    protected $description = 'Create an admin with a private, chosen password';
    public function handle(): int
    {
        $data = ['name' => $this->ask('Name'), 'email' => $this->ask('Email'), 'password' => $this->secret('Password (12 or more characters)')];
        $validator = Validator::make($data, ['name' => 'required|string|max:255', 'email' => 'required|email|unique:users', 'password' => 'required|string|min:12']);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error)
                $this->error($error);
            return self::FAILURE;
        }
        if ($data['password'] !== $this->secret('Repeat password')) {
            $this->error('Passwords do not match.');
            return self::FAILURE;
        }
        User::create([...$data, 'password' => Hash::make($data['password']), 'role' => 'admin']);
        $this->info('Admin created.');
        return self::SUCCESS;
    }
}
