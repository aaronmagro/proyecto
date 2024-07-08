/**
 * Interfaz `Category`
 * 
 * Esta interfaz define la estructura de un objeto categoría utilizado en la aplicación.
 */
export interface Category {
    /**
     * El identificador único de la categoría.
     */
    id: number;

    /**
     * El nombre de la categoría.
     */
    name: string;

    /**
     * La descripción de la categoría.
     */
    desc: string;

    /**
     * El nombre de la categoría en español. Es opcional, solo se usa para recogerlos en edición.
     */
    name_es?: string;

    /**
     * La descripción de la categoría en español. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_es?: string;

    /**
     * El nombre de la categoría en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    name_en?: string;

    /**
     * La descripción de la categoría en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_en?: string;
}
