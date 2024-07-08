<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Translation
 *
 * Representa una traducción en el sistema.
 *
 * @package App\Models
 */
class Translation extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = "translations";

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'language',
        'translation',
    ];

    /**
     * Obtener la traducción dependiendo de la clave y el idioma.
     *
     * @param string $key
     * @param string $language
     * @return \Illuminate\Database\Eloquent\Builder|Model|object|null
     */
    public static function getTranslation($key, $language)
    {
        return Translation::where('key', $key)->where('language', $language)->first();
    }
}
