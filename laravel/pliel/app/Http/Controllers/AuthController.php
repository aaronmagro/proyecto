<?php

namespace App\Http\Controllers;

use App\Models\LoginAttempt;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    private const MAX_ATTEMPTS = 5;
    private const LOCKOUT_TIME = 300; // 5 minutos

    /**
     * Maneja el inicio de sesión del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $ipAddress = $request->ip();
        $loginAttempt = LoginAttempt::firstOrCreate(['ip_address' => $ipAddress]);

        // Verifica si la IP está bloqueada
        if ($loginAttempt->attempts >= self::MAX_ATTEMPTS && Carbon::parse($loginAttempt->last_attempt_at)->diffInSeconds(now()) < self::LOCKOUT_TIME) {
            $remainingLockoutTime = number_format(self::LOCKOUT_TIME - Carbon::parse($loginAttempt->last_attempt_at)->diffInSeconds(now()));
            LogsController::logAction(null, $ipAddress, 'login_too_many_attempts', 'error');
            return response()->json(['message' => 'Demasiados intentos. Por favor, inténtelo de nuevo en ' . $remainingLockoutTime . ' segundos.'], 429);
        }

        $user = User::where('username', $credentials['username'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            $loginAttempt->attempts += 1;
            $loginAttempt->last_attempt_at = now();
            $loginAttempt->save();

            LogsController::logAction(null, $ipAddress, 'login_failed', 'error');
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Reinicia los intentos de inicio de sesión al iniciar sesión correctamente
        $loginAttempt->attempts = 0;
        $loginAttempt->save();

        if ($user->bloqueado) {
            LogsController::logAction($user->id, $ipAddress, 'login_blocked', 'warning');
            return response()->json(['message' => 'Usuario bloqueado'], 403);
        }

        if (!$user->activo) {
            LogsController::logAction($user->id, $ipAddress, 'login_inactive', 'warning');
            return response()->json(['message' => 'Usuario inactivo'], 403);
        }

        Auth::login($user);

        $user->ultimo_acceso = now();
        $user->save();

        LogsController::logAction($user->id, $ipAddress, 'login', 'success');

        $token = $user->createToken('token-name');

        return response()->json([
            'access_token' => $token->accessToken
        ]);
    }

    /**
     * Maneja el cierre de sesión del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Obtiene el usuario autenticado
        $user = $request->user();

        if ($user) {
            // Revoca el token del usuario autenticado
            $user->token()->revoke();
            // Obtiene la dirección IP del cliente
            $ipAddress = $request->ip();
            // Registra la acción de cierre de sesión
            LogsController::logAction($user->id, $ipAddress, 'logout', 'success');

            return response()->json(['message' => 'Sesión cerrada'], 200);
        } else {
            return response()->json(['message' => 'No se ha iniciado sesión'], 401);
        }
    }

    /**
     * Maneja el registro de usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:20|unique:users',
            'email' => 'required|string|email|max:75|unique:users',
            'password' => 'required|string|min:8',
            'nombre' => 'required|string|max:20',
            'apellido1' => 'nullable|string|max:25',
            'apellido2' => 'nullable|string|max:25',
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'nombre' => $request->nombre,
            'activo' => true,
            'bloqueado' => false,
            'apellido1' => $request->apellido1,
            'apellido2' => $request->apellido2,
        ]);

        // Obtiene el ID del rol ROLE_USER
        $roleUser = Role::where('name', 'ROLE_USER')->first();

        // Asigna el rol al usuario
        if ($roleUser) {
            $user->roles()->attach($roleUser);
        } else {
            throw new \Exception('El rol ROLE_USER no existe en la base de datos.');
        }

        $token = $user->createToken('token-name');

        // Registra la acción de registro
        LogsController::logAction($user->id, $request->ip(), 'register', 'success');

        return response()->json([
            'access_token' => $token->accessToken,
            'token_type' => 'Bearer',
            'username' => $user->username,
            'roles' => $user->roleNames(),
        ]);
    }

    /**
     * Autentica al usuario utilizando Google OAuth.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public static function authenticateWithGoogle()
    {
        try {
            // Obtener los datos del usuario desde Google OAuth
            $googleUser = Socialite::driver('google')->user();

            // Buscar si el usuario ya existe en la base de datos por su correo electrónico o ID de Google
            $user = User::where('email', $googleUser->email)
                ->orWhere('google_id', $googleUser->id)
                ->first();

            // Si el usuario no existe, crear uno nuevo
            if (!$user) {
                $user = User::create([
                    'email' => $googleUser->email,
                    'username' => self::generarNombreDeUsuario($googleUser),
                    'nombre' => explode(' ', $googleUser->name)[0],
                    'apellido1' => explode(' ', $googleUser->name)[1] ?? null,
                    'apellido2' => explode(' ', $googleUser->name)[2] ?? null,
                    'google_id' => $googleUser->id,
                    'foto' => $googleUser->avatar,
                    'activo' => true,
                    'bloqueado' => false,
                    'ultimo_acceso' => now(),
                    'password' => Hash::make(Str::random(24)),
                ]);

                // Asignar el rol ROLE_USER al usuario
                $roleUser = Role::where('name', 'ROLE_USER')->first();
                if ($roleUser) {
                    $user->roles()->attach($roleUser);
                } else {
                    throw new \Exception('El rol ROLE_USER no existe en la base de datos.');
                }
            } else {
                // Si el usuario existe pero no tiene ID de Google, actualizar su ID de Google
                if (empty($user->google_id)) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            }

            // Verificar si el usuario está bloqueado
            if ($user->bloqueado) {
                LogsController::logAction($user->id, request()->ip(), 'login_google_blocked', 'warning');
                return redirect()->to('https://pliel.es/login-callback/?error=Usuario bloqueado');
            }

            // Verificar si el usuario está activo
            if (!$user->activo) {
                LogsController::logAction($user->id, request()->ip(), 'login_google_inactive', 'warning');
                return redirect()->to('https://pliel.es/login-callback/?error=Usuario inactivo');
            }

            // Actualizar el último acceso del usuario
            $user->ultimo_acceso = now();
            $user->save();

            // Registrar la acción de inicio de sesión con Google
            LogsController::logAction($user->id, request()->ip(), 'login_google', 'success');

            // Crear un token de acceso para el usuario
            $token = $user->createToken('token-name');

            // Redirigir a la página de inicio con el token de acceso
            return redirect()->to('https://pliel.es/login-callback/?access_token='.$token->accessToken);

        } catch (\Exception $e) {
            // Registrar el error de autenticación
            LogsController::logAction(null, request()->ip(), 'login_google_failed', 'error');
            return redirect()->to('https://pliel.es/login-callback/?error=Error de autenticación');
        }
    }

    /**
     * Retorna la información del usuario autenticado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function info(Request $request)
    {
        if (Auth::check()) {
            // Obtener el usuario autenticado
            $user = Auth::user();
            $fotoPath = null;

            // Verificar si el usuario tiene una foto y obtener su ruta
            if ($user->foto) {
                if (preg_match('/^(http|https):\/\//', $user->foto)) {
                    // Si la foto es una URL externa, utilizarla directamente
                    $fotoPath = $user->foto;
                } else {
                    // Si la foto es un archivo local, construir su URL completa
                    $fotoPath = url(Storage::url($user->foto));
                }
            }

            // Retornar la información del usuario en formato JSON
            return response()->json([
                'id' => $user->id,
                'username' => $user->username,
                'roles' => $user->roleNames(),
                'email' => $user->email,
                'nombre' => $user->nombre,
                'apellido1' => $user->apellido1,
                'apellido2' => $user->apellido2,
                'activo' => $user->activo,
                'foto' => $fotoPath,
                'bloqueado' => $user->bloqueado,
                'ultimo_acceso' => $user->ultimo_acceso,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]);
        } else {
            // Si no hay sesión iniciada, retornar un error
            return response()->json(['message' => 'No se ha iniciado sesión'], 401);
        }
    }

    /**
     * Genera un nombre de usuario único a partir del nombre de usuario de Google.
     *
     * @param  mixed  $googleUser
     * @return string
     */
    public static function generarNombreDeUsuario($googleUser) {
        // Normalizar el nombre: convertir a minúsculas y reemplazar vocales acentuadas.
        $nombre = strtolower(str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], explode(' ', $googleUser->name)[0]));

        // Si el nombre de usuario ya existe, añadir un contador al final.
        $username = $nombre;
        $contador = 1;
        while (User::where('username', $username)->exists()) {
            $username = $nombre . $contador;
            $contador++;
        }

        return $username;
    }

    /**
     * Actualiza el perfil del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(Request $request)
    {
        $user = Auth::user();

        // Validar los datos del formulario
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:20|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:75|unique:users,email,' . $user->id,
            'nombre' => 'required|string|max:20',
            'apellido1' => 'nullable|string|max:25',
            'apellido2' => 'nullable|string|max:25',
            'password' => 'required|string',
            'foto' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Para archivos locales
            'foto_url' => 'nullable|url' // Para URLs externas
        ]);

        // Si la validación falla, retornar los errores
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verificar si la contraseña actual del usuario coincide
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Si se carga un archivo de foto
            if ($request->hasFile('foto')) {
                // Verificar si el directorio existe, si no, crearlo
                if (!Storage::exists('public/fotos')) {
                    Storage::makeDirectory('public/fotos');
                }

                // Guardar la nueva foto
                $file = $request->file('foto');
                $filename = Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/fotos', $filename);

                // Eliminar la foto antigua si existe y es un archivo local
                if ($user->foto && !preg_match('/^(http|https):\/\//', $user->foto)) {
                    Storage::delete($user->foto);
                }

                // Actualizar el campo foto del usuario con la ruta del archivo
                $user->foto = $path;
            } elseif ($request->foto_url) {
                // Si se proporciona una URL externa para la foto
                $user->foto = $request->foto_url;
            }

            // Actualizar otros campos del usuario
            $user->update($request->only('username', 'email', 'nombre', 'apellido1', 'apellido2'));

            // Confirmar la transacción de base de datos
            DB::commit();

            // Retornar una respuesta exitosa con los datos del usuario actualizados
            return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
        } catch (\Exception $e) {
            // En caso de error, revertir la transacción
            DB::rollBack();
            return response()->json(['message' => 'Profile update failed', 'error' => $e->getMessage()], 500);
        }
    }



    /**
     * Actualiza la contraseña del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        // Validar los campos del formulario
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string'
        ]);

        // Si la validación falla, retornar los errores
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verificar si la contraseña actual del usuario coincide
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 403);
        }

        // Verificar si la nueva contraseña es diferente de la actual
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json(['error' => 'New password must be different from the current password'], 400);
        }

        // Verificar si la nueva contraseña coincide con la confirmación
        if ($request->new_password !== $request->new_password_confirmation) {
            return response()->json(['error' => 'New password and confirmation do not match'], 400);
        }

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Actualizar la contraseña del usuario
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Confirmar la transacción de base de datos
            DB::commit();

            // Retornar una respuesta exitosa
            return response()->json(['message' => 'Password updated successfully']);
        } catch (\Exception $e) {
            // En caso de error, revertir la transacción
            DB::rollBack();
            return response()->json(['message' => 'Password update failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina al usuario actual.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser(Request $request)
    {
        $user = Auth::user();

        // Validar si la contraseña proporcionada coincide con la del usuario
        $validator = Validator::make($request->all(), [
            'password' => 'required|string'
        ]);

        // Si la validación falla, retornar los errores
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verificar si la contraseña proporcionada es correcta
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password is incorrect'], 403);
        }

        // Iniciar una transacción de base de datos
        DB::beginTransaction();

        try {
            // Eliminar al usuario
            $user->delete();

            // Confirmar la transacción de base de datos
            DB::commit();

            // Retornar una respuesta exitosa
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            // En caso de error, revertir la transacción
            DB::rollBack();
            return response()->json(['message' => 'User deletion failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene los roles del usuario actual.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoles(Request $request)
    {
        $user = Auth::user();

        // Verificar si el usuario está autenticado
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Obtener los roles del usuario
        $roles = $user->roles->pluck('name');

        // Retornar los roles en formato JSON
        return response()->json($roles);
    }


}
