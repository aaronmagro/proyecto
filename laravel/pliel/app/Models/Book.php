<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Book
 *
 * Representa un libro en el sistema.
 *
 * @package App\Models
 */
class Book extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = "books";

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'isbn', 'key_title', 'publisher', 'language', 'author', 'key_description', 'price', 'image', 'subcategory_id', 'average_rating', 'rating_count', 'comments_count'
    ];

    /**
     * Los valores predeterminados del modelo para los atributos.
     *
     * @var array
     */
    protected $attributes = [
        'average_rating' => 0,
        'rating_count' => 0,
        'comments_count' => 0,
    ];

    /**
     * Obtén el atributo de imagen.
     *
     * @param  string  $value
     * @return string
     */
    public function getImageAttribute($value)
    {
        // Verifica si la imagen es una URL completa o un path local
        if (preg_match('/^(http|https):\/\//', $value)) {
            return $value;
        }

        // Si es un path local, construye la URL completa
        return asset('storage/' . $value);
    }

    /**
     * Obtén las traducciones para el libro.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations()
    {
        return $this->hasMany(Translation::class, 'key', 'key_title');
    }

    /**
     * Obtén la traducción para el libro.
     *
     * @param  string  $language
     * @param  string  $type
     * @return string|null
     */
    public function getTranslation($language, $type)
    {
        $key = $type == 'title' ? $this->key_title : $this->key_description;
        return Translation::where('key', $key)->where('language', $language)->first()->translation ?? null;
    }

}
