<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Método de prueba accesible públicamente.
     */
    public function prueba1(){
        return response()->json(['message'=>'Acceso permitido a prueba1 (público)']);
    }

    /**
     * Método de prueba accesible solo para usuarios autenticados.
     */
    public function prueba2(){
        return response()->json(['message'=>'Acceso permitido a prueba2 (autenticado)']);
    }

    /**
     * Método de prueba accesible solo para usuarios con el rol de administrador.
     */
    public function prueba3(){
        return response()->json(['message'=>'Acceso permitido a prueba3 (ROLE_ADMIN)']);
    }

    /**
     * Método de prueba accesible solo para usuarios con el rol de usuario.
     */
    public function prueba4(){
        return response()->json(['message'=>'Acceso permitido a prueba4 (ROLE_USER)']);
    }
}
