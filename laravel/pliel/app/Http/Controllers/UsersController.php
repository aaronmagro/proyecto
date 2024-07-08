<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Notifications\UserCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    /**
     * Muestra una lista de todos los usuarios excepto el usuario autenticado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Obtener el ID del usuario autenticado
        $authenticatedUserId = auth()->id();

        // Verifica si el usuario está autenticado
        if (!$authenticatedUserId) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Devolver todos los usuarios con su rol menos el usuario autenticado
        $users = User::where('id', '!=', $authenticatedUserId)->get();

        foreach ($users as $user) {
            $user->roles = $user->roles()->first()->name;
        }

        return response()->json($users, 200);
    }

    /**
     * Almacena un nuevo usuario en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:20|unique:users',
            'email' => 'required|string|email|max:75|unique:users',
            'nombre' => 'required|string|max:20',
            'apellido1' => 'nullable|string|max:25',
            'apellido2' => 'nullable|string|max:25',
            'roles' => 'required|string|exists:roles,name',
            'activo' => 'required|boolean',
            'bloqueado' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $password = Str::random(12);
            $hashedPassword = Hash::make($password);

            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => $hashedPassword,
                'nombre' => $request->nombre,
                'apellido1' => $request->apellido1,
                'apellido2' => $request->apellido2,
                'activo' => $request->activo,
                'bloqueado' => $request->bloqueado,
            ]);

            $role = Role::where('name', $request->roles)->first();
            if ($role) {
                $user->roles()->attach($role);
            }

            // Enviar la contraseña por correo electrónico utilizando la notificación UserCreatedNotification
            $user->notify(new UserCreatedNotification($password));

            DB::commit();

            return response()->json($user, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error en la creación del usuario', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Muestra la información del usuario especificado.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Devolver respuesta también con el rol del usuario
        $user->role = $user->roles()->first()->name;

        return response()->json($user, 200);
    }

    /**
     * Actualiza la información del usuario especificado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:20|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:75|unique:users,email,' . $user->id,
            'nombre' => 'required|string|max:20',
            'apellido1' => 'nullable|string|max:25',
            'apellido2' => 'nullable|string|max:25',
            'roles' => 'required|string|exists:roles,name',
            'activo' => 'required|boolean',
            'bloqueado' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $user->update([
                'username' => $request->username,
                'email' => $request->email,
                'nombre' => $request->nombre,
                'apellido1' => $request->apellido1,
                'apellido2' => $request->apellido2,
                'activo' => $request->activo,
                'bloqueado' => $request->bloqueado,
            ]);

            $role = Role::where('name', $request->roles)->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }

            DB::commit();

            return response()->json(['message' => 'Usuario actualizado con éxito', 'user' => $user]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error en la actualización del usuario', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina el usuario especificado.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar si el usuario autenticado es el mismo que se va a eliminar
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'No puedes eliminarte a ti mismo'], 403);
        }

        // Verificar si el usuario autenticado es administrador para no permitir eliminarlo
        if ($user->hasRole('ROLE_ADMIN')) {
            return response()->json(['error' => 'No puedes eliminar a un administrador'], 403);
        }

        DB::beginTransaction();
        try {
            // Eliminar la foto si existe y no es una URL
            if ($user->foto && !preg_match('/^(http|https):\/\//', $user->foto)) {
                Storage::delete($user->foto);
            }

            $user->delete();

            // Eliminar la relación con el rol
            $user->roles()->detach();

            // Eliminar los comentarios del usuario
            $user->comments()->delete();

            DB::commit();

            return response()->json(['message' => 'Usuario eliminado con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error en la eliminación del usuario', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verifica la disponibilidad de un nombre de usuario.
     *
     * @param  string  $username
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkUsername($username, $userId)
    {
        $user = User::where('username', $username)->where('id', '!=', $userId)->first();
        return response()->json($user === null);
    }

    /**
     * Verifica la disponibilidad de un correo electrónico.
     *
     * @param  string  $email
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEmail($email, $userId)
    {
        $user = User::where('email', $email)->where('id', '!=', $userId)->first();
        return response()->json($user === null);
    }
}
