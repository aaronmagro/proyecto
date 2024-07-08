<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
    /**
     * Muestra los comentarios de un libro específico, incluyendo las respuestas anidadas y la información del usuario.
     *
     * @param int $bookId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($bookId)
    {
        // Obtener comentarios principales y todas las respuestas anidadas con la información del usuario
        $comments = Comment::where('book_id', $bookId)
            ->whereNull('parent_id')
            ->with([
                'user',
                'replies' => function ($query) {
                    $query->with([
                        'user',
                        'replies.user',
                        'replies.replies' => function ($query) {
                            $query->with('user');
                        }
                    ]);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Función recursiva para transformar la URL de la foto del usuario si es necesario
        $transformUserPhotoUrl = function ($comment) use (&$transformUserPhotoUrl) {
            if ($comment->user && $comment->user->foto && !preg_match('/^(http|https):\/\//', $comment->user->foto)) {
                $comment->user->foto = url(Storage::url($comment->user->foto));
            }

            if ($comment->replies) {
                foreach ($comment->replies as $reply) {
                    $transformUserPhotoUrl($reply);
                }
            }
        };

        // Aplicar la transformación a los comentarios principales
        foreach ($comments as $comment) {
            $transformUserPhotoUrl($comment);
        }

        return response()->json($comments);
    }

    /**
     * Guarda un nuevo comentario para un libro específico.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $bookId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $bookId)
    {
        // Validar la entrada
        $validated = $request->validate([
            'comment_content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Crear el comentario
            $comment = Comment::create([
                'book_id' => $bookId,
                'user_id' => Auth::id(),
                'comment_content' => $validated['comment_content'],
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            // Sumar 1 al contador de comentarios del libro
            $book = Book::findOrFail($bookId);
            $book->increment('comments_count');

            // Cargar la relación del usuario
            $comment->load('user');

            // Transformar la URL de la foto del usuario si es necesario
            if ($comment->user->foto && !preg_match('/^(http|https):\/\//', $comment->user->foto)) {
                $comment->user->foto = url(Storage::url($comment->user->foto));
            }

            // Confirmar la transacción
            DB::commit();

            return response()->json($comment, 201);
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            // Registrar el error
            Log::error('Error al guardar el comentario: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error al guardar el comentario. Por favor, inténtelo de nuevo más tarde.'
            ], 500);
        }
    }

    /**
     * Elimina un comentario específico y sus respuestas anidadas.
     *
     * @param int $bookId
     * @param int $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($bookId, $commentId)
    {
        // Buscar el comentario
        $comment = Comment::findOrFail($commentId);

        // Verificar si el usuario autenticado es el propietario del comentario o si es un administrador
        if (Auth::id() !== $comment->user_id && !Auth::user()->roles->contains('name', 'ROLE_ADMIN')) {
            return response()->json(['error' => 'No tienes permiso para eliminar este comentario.'], 403);
        }

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Eliminar el comentario y sus respuestas anidadas
            $comment->delete();

            // Decrementar el contador de comentarios del libro
            $book = Book::findOrFail($comment->book_id);
            $book->decrement('comments_count');

            // Confirmar la transacción
            DB::commit();

            return response()->json(['message' => 'Comentario eliminado correctamente.']);
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            // Registrar el error
            Log::error('Error al eliminar el comentario: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error al eliminar el comentario. Por favor, inténtelo de nuevo más tarde.'
            ], 500);
        }
    }
}
