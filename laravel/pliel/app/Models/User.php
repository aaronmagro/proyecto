<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\RolesTrait;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
//use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Passport\HasApiTokens;
use Laravel\Socialite\Facades\Socialite;

/**
 * Clase User
 *
 * Representa un usuario en el sistema.
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;
    use RolesTrait;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'google_id',
        'nombre',
        'apellido1',
        'apellido2',
        'foto',
        'activo',
        'bloqueado',
        'ultimo_acceso',
    ];

    /**
     * Los atributos que deben ser ocultos para la serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser convertidos a instancias de Carbon.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'activo' => 'boolean',
        'bloqueado' => 'boolean',
        'ultimo_acceso' => 'datetime',
    ];

    /**
     * Obtén los roles asociados con el usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Obtén los comentarios realizados por el usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Obtén las calificaciones realizadas por el usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Obtén los registros de actividad del usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userLogs()
    {
        return $this->hasMany(UserLog::class);
    }

}
