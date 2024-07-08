/**
 * Interfaz `Translation`
 * 
 * Esta interfaz define la estructura de un objeto de traducción utilizado en la aplicación.
 * El objeto de traducción es un diccionario que asocia claves de traducción con sus valores correspondientes.
 */
export interface Translation {
    /**
     * Clave de traducción asociada con su valor correspondiente.
     */
    [key: string]: string;
}
