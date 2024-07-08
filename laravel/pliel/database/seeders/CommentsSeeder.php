<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Comment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentsSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run()
    {
        // Crear un comentario del usuario 1
        $comment1 = Comment::create([
            'book_id' => 1,
            'user_id' => 1,
            'comment_content' => 'Este es el primer comentario de prueba para el libro 1.'
        ]);

        // Crear una respuesta del usuario 2 al comentario del usuario 1
        $comment2 = Comment::create([
            'book_id' => 1,
            'user_id' => 2,
            'comment_content' => 'Esta es una respuesta del usuario 2 al primer comentario del usuario 1.',
            'parent_id' => $comment1->id
        ]);

        // Crear una respuesta del usuario 3 a la respuesta del usuario 2
        $comment3 = Comment::create([
            'book_id' => 1,
            'user_id' => 3,
            'comment_content' => 'Esta es una respuesta del usuario 3 a la respuesta del usuario 2.',
            'parent_id' => $comment2->id
        ]);

        // Crear un comentario del usuario 2
        $comment4 = Comment::create([
            'book_id' => 1,
            'user_id' => 2,
            'comment_content' => 'Este es el segundo comentario de prueba para el libro 1.'
        ]);

        // Crear una respuesta del usuario 1 al comentario del usuario 2
        Comment::create([
            'book_id' => 1,
            'user_id' => 1,
            'comment_content' => 'Esta es una respuesta del usuario 1 al segundo comentario del usuario 2.',
            'parent_id' => $comment4->id
        ]);

        // Crear un comentario del usuario 3
        $comment5 = Comment::create([
            'book_id' => 1,
            'user_id' => 3,
            'comment_content' => 'Este es el tercer comentario de prueba para el libro 1.'
        ]);

        // Crear una respuesta del usuario 1 al comentario del usuario 3
        $comment6 = Comment::create([
            'book_id' => 1,
            'user_id' => 1,
            'comment_content' => 'Esta es una respuesta del usuario 1 al tercer comentario del usuario 3.',
            'parent_id' => $comment5->id
        ]);

        // Crear una respuesta del usuario 2 al comentario del usuario 3
        $comment7 = Comment::create([
            'book_id' => 1,
            'user_id' => 2,
            'comment_content' => 'Esta es una respuesta del usuario 2 al tercer comentario del usuario 3.',
            'parent_id' => $comment5->id
        ]);

        // Crear una respuesta del usuario 3 a la respuesta del usuario 2 del comentario del usuario 3
        Comment::create([
            'book_id' => 1,
            'user_id' => 3,
            'comment_content' => 'Esta es una respuesta del usuario 3 a la respuesta del usuario 2 del tercer comentario del usuario 3.',
            'parent_id' => $comment7->id
        ]);


        // Actualizar la información del libro 1 para ponerle el comments_count
        $book = Book::find(1);
        $bookComments = Comment::where('book_id', 1)->get();

        $count = $bookComments->count();

        $book->comments_count = $count;
        $book->save();
    }
}
