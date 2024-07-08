/**
 * Interfaz `User`
 * 
 * Esta interfaz define la estructura de un objeto usuario utilizado en la aplicación.
 */
export interface User {
    /**
     * El identificador único del usuario. Es opcional ya que puede no estar presente en algunas situaciones (por ejemplo, al crear un nuevo usuario).
     */
    id?: number;

    /**
     * El nombre de usuario.
     */
    username: string;

    /**
     * La contraseña del usuario.
     */
    password: string;

    /**
     * El correo electrónico del usuario.
     */
    email: string;

    /**
     * El nombre del usuario.
     */
    nombre: string;

    /**
     * El primer apellido del usuario. Es opcional.
     */
    apellido1?: string;

    /**
     * El segundo apellido del usuario. Es opcional.
     */
    apellido2?: string;

    /**
     * Indica si el usuario está activo. Es opcional.
     */
    activo?: boolean;

    /**
     * Indica si el usuario está bloqueado. Es opcional.
     */
    bloqueado?: boolean;

    /**
     * La fecha y hora del último acceso del usuario. Es opcional.
     */
    ultimo_acceso?: Date;

    /**
     * La URL de la foto del usuario. Es opcional.
     */
    foto?: string;

    /**
     * La fecha y hora en la que se creó el usuario. Es opcional.
     */
    created_at?: Date;

    /**
     * La fecha y hora en la que se actualizó el usuario por última vez. Es opcional.
     */
    updated_at?: Date;

    /**
     * Los roles asignados al usuario, por ejemplo, `ROLE_USER`, `ROLE_ADMIN`, etc. Es opcional.
     */
    roles?: [string];
}
