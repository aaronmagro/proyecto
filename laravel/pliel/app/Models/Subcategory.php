<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Subcategory
 *
 * Representa una subcategoría en el sistema.
 *
 * @package App\Models
 */
class Subcategory extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = "subcategories";

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'category_id', 'key_name', 'key_description'
    ];

    /**
     * Obtén las traducciones de descripción para la subcategoría.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function descriptionTranslations()
    {
        return $this->hasMany(Translation::class, 'key', 'key_description');
    }

    /**
     * Obtén las traducciones para la subcategoría.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations()
    {
        return $this->hasMany(Translation::class, 'key', 'key_name');
    }
}
