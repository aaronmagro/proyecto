<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    /**
     * Obtiene las estadísticas de los usuarios.
     *
     * Este método recupera las estadísticas de comentarios y valoraciones para cada usuario.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserStatistics()
    {
        // Obtener las estadísticas para cada usuario
        $users = User::select('id', 'username')
            ->withCount([
                'comments',
                'comments as replies_count' => function ($query) {
                    $query->whereNotNull('parent_id');
                },
                'comments as main_comments_count' => function ($query) {
                    $query->whereNull('parent_id');
                }
            ])
            ->with(['ratings' => function ($query) {
                $query->select('user_id', DB::raw('AVG(rating) as average_rating'))
                    ->groupBy('user_id');
            }])
            // Recoger también el número de valoraciones a los libros
            ->withCount(['ratings as rating_count'])
            ->get();

        // Transformar los datos para la respuesta
        $statistics = $users->map(function ($user) {
            return [
                'username' => $user->username,
                'main_comments_count' => $user->main_comments_count,
                'replies_count' => $user->replies_count,
                'average_rating' => $user->ratings->first()->average_rating ?? null,
                'rating_count' => $user->rating_count
            ];
        });

        return response()->json($statistics);
    }
}
