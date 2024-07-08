/**
 * Interfaz `Subcategory`
 * 
 * Esta interfaz define la estructura de un objeto subcategoría utilizado en la aplicación.
 */
export interface Subcategory {
    /**
     * El identificador único de la subcategoría.
     */
    id: number;

    /**
     * El nombre de la subcategoría.
     */
    name: string;

    /**
     * La descripción de la subcategoría.
     */
    desc: string;

    /**
     * El identificador de la categoría a la que pertenece la subcategoría.
     */
    category_id: number;

    /**
     * El nombre de la subcategoría en español. Es opcional, solo se usa para recogerlos en edición.
     */
    name_es?: string;

    /**
     * La descripción de la subcategoría en español. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_es?: string;

    /**
     * El nombre de la subcategoría en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    name_en?: string;

    /**
     * La descripción de la subcategoría en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_en?: string;
}
