<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Library;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Library::query();

        if ($search) {
            $query->where('title', 'LIKE', "%{$search}%")
                ->orWhere('author', 'LIKE', "%{$search}%")
                ->orWhere('isbn', 'LIKE', "%{$search}%");
        }

        $books = $query->get();

        return response()->json([
            'success' => true,
            'data' => $books,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:libraries',
            'status' => 'required|in:available,issued',
            'quantity' => 'required|integer|min:1|max:100000',
        ]);

        $book = Library::create($data);

        return response()->json([
            'success' => true,
            'data' => $book,
            'message' => 'Book added successfully',
        ]);
    }

    public function show($id)
    {
        $book = Library::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Library::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:255|unique:libraries,isbn,' . $id,
            'status' => 'required|in:available,issued',
            'quantity' => 'required|integer|min:1|max:100000',
        ]);

        $book->update($data);

        return response()->json([
            'success' => true,
            'data' => $book,
            'message' => 'Book updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $book = Library::findOrFail($id);
        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book deleted successfully',
        ]);
    }
}