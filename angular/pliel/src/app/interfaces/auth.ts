/**
 * Interfaz `LoginRequest`
 * 
 * Esta interfaz define la estructura del objeto que se envía al servidor al realizar una solicitud de inicio de sesión.
 */
export interface LoginRequest {
    /**
     * El nombre de usuario del usuario que intenta iniciar sesión.
     */
    username: string;

    /**
     * La contraseña del usuario que intenta iniciar sesión.
     */
    password: string;
}


/**
 * Interfaz `LoginResponse`
 * 
 * Esta interfaz define la estructura del objeto que se recibe del servidor en respuesta a una solicitud de inicio de sesión.
 */
export interface LoginResponse {
    /**
     * El identificador único del usuario.
     */
    id: number;
    
    /**
     * El token de acceso proporcionado por el servidor para autenticar las solicitudes subsecuentes.
     */
    access_token: string;
    
    /**
     * Los roles asignados al usuario: `ROLE_USER`, `ROLE_ADMIN`
     */
    roles: [string];
    
    /**
     * El nombre de usuario del usuario autenticado.
     */
    username: string;
}
