<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    /**
     * Almacena o actualiza una valoración para un libro.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'rating' => 'required|numeric|between:1,5'
        ]);

        DB::beginTransaction(); // Iniciar una transacción para asegurar la atomicidad
        try {
            // Encontrar el libro a partir del ID
            $book = Book::findOrFail($validated['book_id']);
            $userId = auth()->id();

            // Buscar si ya existe una valoración del usuario para este libro
            $rating = Rating::firstOrNew(
                ['book_id' => $book->id, 'user_id' => $userId]
            );

            // Actualizar o crear la valoración
            $rating->rating = $validated['rating'];
            $rating->save();

            // Actualizar la valoración media y el contador en la tabla de libros
            $average = Rating::where('book_id', $book->id)->avg('rating');
            $count = Rating::where('book_id', $book->id)->count();

            $book->average_rating = $average;
            $book->rating_count = $count;
            $book->save();

            DB::commit(); // Confirmar la transacción si todo está correcto

            return response()->json([
                'message' => 'Rating updated successfully!',
                'book' => [
                    'average_rating' => $average,
                    'rating_count' => $count
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback(); // Revertir la transacción en caso de error
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Muestra la valoración media y el número de valoraciones de un libro.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $average = Rating::where('book_id', $id)->avg('rating');
        $count = Rating::where('book_id', $id)->count();

        if (!$average) {
            return response()->json(['message' => 'No ratings found for this book']);
        } else {
            return response()->json(['average_rating' => $average , 'rating_count' => $count]);
        }
    }

    /**
     * Muestra la valoración de un usuario para un libro específico.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showUserRating($id) {
        $userId = auth()->id();
        $rating = Rating::where('book_id', $id)->where('user_id', $userId)->first();

        if (!$rating) {
            return response()->json(['message' => 'No rating found for this book']);
        } else {
            return response()->json(['rating' => $rating->rating]);
        }
    }
}
