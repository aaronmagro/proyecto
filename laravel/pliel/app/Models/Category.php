<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Category
 *
 * Representa una categoría en el sistema.
 *
 * @package App\Models
 */
class Category extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = "categories";

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'key_name', 'key_description'
    ];

    /**
     * Obtén las traducciones de descripción para la categoría.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function descriptionTranslations()
    {
        return $this->hasMany(Translation::class, 'key', 'key_description');
    }

    /**
     * Obtén las traducciones para la categoría.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations()
    {
        return $this->hasMany(Translation::class, 'key', 'key_name');
    }

}
