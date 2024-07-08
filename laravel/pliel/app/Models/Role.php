<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase Role
 *
 * Representa un rol en el sistema.
 *
 * @package App\Models
 */
class Role extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = "roles";

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Obtén los usuarios asociados con el rol.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }
}
