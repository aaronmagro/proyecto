<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Rating
 *
 * Representa una calificación en el sistema.
 *
 * @package App\Models
 */
class Rating extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = ['book_id', 'user_id', 'rating'];

    /**
     * Obtén el usuario que hizo la calificación.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtén el libro que fue calificado.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function book() {
        return $this->belongsTo(Book::class);
    }
}
