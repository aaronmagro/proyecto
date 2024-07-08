<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Clase LoginAttempt
 *
 * Representa un intento de inicio de sesión en el sistema.
 *
 * @package App\Models
 */
class LoginAttempt extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'ip_address', 'attempts', 'last_attempt_at'
    ];

    /**
     * Los campos que deben ser convertidos a instancias de Carbon.
     *
     * @var array
     */
    protected $dates = ['last_attempt_at'];
}
