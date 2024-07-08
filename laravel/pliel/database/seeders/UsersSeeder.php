<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        $user = User::create( ['username'=>'admin', 'password'=>Hash::make('admin'), 'email'=>'admin@admin', 'nombre'=>'admin', 'apellido1'=>'admini', 'apellido2'=>'admini2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://kinsta.com/wp-content/uploads/2020/08/tiger-jpg.jpg']);
        $user->syncRoles(['ROLE_ADMIN']);

        $user = User::create( ['username'=>'user', 'password'=>Hash::make('user'), 'email'=>'user@user', 'nombre'=>'User', 'apellido1'=>'Useri', 'apellido2'=>'Useri2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Domestic_cat_sleeping.JPG/640px-Domestic_cat_sleeping.JPG']);
        $user->syncRoles(['ROLE_USER']);

        $user = User::create( ['username'=>'user2', 'password'=>Hash::make('user2'), 'email'=>'user2@user2', 'nombre'=>'User2', 'apellido1'=>'Usero', 'apellido2'=>'Usero2', 'activo'=>false ,'bloqueado'=>true, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg']);
        $user->syncRoles(['ROLE_USER']);

        $user = User::create( ['username'=>'user3', 'password'=>Hash::make('user3'), 'email'=>'user3@user3', 'nombre'=>'User3', 'apellido1'=>'Useru', 'apellido2'=>'Useru2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Maine_Coon_Meowing_2.jpg/640px-Maine_Coon_Meowing_2.jpg']);
        $user->syncRoles(['ROLE_USER']);

        $user = User::create( ['username'=>'user4', 'password'=>Hash::make('user4'), 'email'=>'user4@user4', 'nombre'=>'User4', 'apellido1'=>'Usery', 'apellido2'=>'Usery2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Maine_Coon_blanc.jpg/640px-Maine_Coon_blanc.jpg']);
        $user->syncRoles(['ROLE_USER']);

        $user = User::create( ['username'=>'user5', 'password'=>Hash::make('user5'), 'email'=>'user5@user5', 'nombre'=>'User5', 'apellido1'=>'Usera', 'apellido2'=>'Usera2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Maine_Coon_2.JPG/640px-Maine_Coon_2.JPG']);
        $user->syncRoles(['ROLE_USER']);

        $user = User::create( ['username'=>'invi', 'password'=>Hash::make('invi'), 'email'=>'invi@invi', 'nombre'=>'invi', 'apellido1'=>'invitado', 'apellido2'=>'invitado2', 'activo'=>true ,'bloqueado'=>false, 'ultimo_acceso'=>now(), 'foto'=>'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Maine_Coon_2.JPG/640px-Maine_Coon_2.JPG']);
        $user->syncRoles(['ROLE_USER']);
    }
}
