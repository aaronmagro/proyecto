<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Rating;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RatingsSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        $ratings = [
            ['book_id' => 1, 'user_id' => 1, 'rating' => 4],
            ['book_id' => 1, 'user_id' => 2, 'rating' => 3],
            ['book_id' => 1, 'user_id' => 3, 'rating' => 5],
        ];

        foreach ($ratings as $rating) {
            Rating::create($rating);
        }

        // Actualizar la información del libro 1
        $book = Book::find(1);
        $bookRatings = Rating::where('book_id', 1)->get();

        // Calcular el promedio de las calificaciones y el número de calificaciones
        $average = $bookRatings->avg('rating');
        $count = $bookRatings->count();

        $book->average_rating = $average;
        $book->rating_count = $count;
        $book->save();
    }
}
