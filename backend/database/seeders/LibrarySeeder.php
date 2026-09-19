<?php

namespace Database\Seeders;

use App\Models\Library;
use Illuminate\Database\Seeder;

class LibrarySeeder extends Seeder
{
    public function run()
    {
        $books = [
            ['title' => 'Introduction to Algorithms', 'author' => 'Thomas H. Cormen', 'isbn' => '978-0262033848', 'status' => 'available', 'quantity' => 3],
            ['title' => 'The Art of Computer Programming', 'author' => 'Donald E. Knuth', 'isbn' => '978-0321751041', 'status' => 'issued', 'quantity' => 2],
            ['title' => 'Clean Code', 'author' => 'Robert C. Martin', 'isbn' => '978-0132350884', 'status' => 'available', 'quantity' => 5],
            ['title' => 'Design Patterns', 'author' => 'Erich Gamma', 'isbn' => '978-0201633610', 'status' => 'available', 'quantity' => 4],
            ['title' => 'Computer Networks', 'author' => 'Andrew S. Tanenbaum', 'isbn' => '978-0132126953', 'status' => 'issued', 'quantity' => 2],
        ];

        foreach ($books as $book) {
            Library::create($book);
        }
    }
}