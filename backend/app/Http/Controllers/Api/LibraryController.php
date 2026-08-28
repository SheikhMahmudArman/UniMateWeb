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
        $request->validate([
            'title' => 'required',
            'author' => 'required',
            'isbn' => 'required|unique:libraries',
            'status' => 'required|in:available,issued',
            'quantity' => 'required|integer|min:1',
        ]);

        $book = Library::create($request->all());

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

        $request->validate([
            'title' => 'required',
            'author' => 'required',
            'isbn' => 'required|unique:libraries,isbn,' . $id,
            'status' => 'required|in:available,issued',
            'quantity' => 'required|integer|min:1',
        ]);

        $book->update($request->all());

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