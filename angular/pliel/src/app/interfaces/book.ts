/**
 * Interfaz `Book`
 * 
 * Esta interfaz define la estructura de un objeto libro utilizado en la aplicación.
 */
export interface Book {
    /**
     * El identificador único del libro. Es opcional ya que puede no estar presente en algunas situaciones (por ejemplo, al crear un nuevo libro).
     */
    id?: number;

    /**
     * El ISBN del libro.
     */
    isbn: string;

    /**
     * El título del libro.
     */
    title: string;

    /**
     * La editorial que publica el libro.
     */
    publisher: string;

    /**
     * El idioma en el que está escrito el libro.
     */
    language: string;

    /**
     * El autor del libro.
     */
    author: string;

    /**
     * La descripción del libro.
     */
    desc: string;

    /**
     * El precio del libro.
     */
    price: number;

    /**
     * La URL de la imagen de la portada del libro.
     */
    image: string;

    /**
     * El identificador de la subcategoría a la que pertenece el libro.
     */
    subcategory_id: number;

    /**
     * La calificación promedio del libro.
     */
    average_rating: number;

    /**
     * El número de calificaciones recibidas por el libro.
     */
    rating_count: number;

    /**
     * El número de comentarios recibidos por el libro.
     */
    comments_count: number;

    /**
     * El título del libro en español. Es opcional, solo se usa para recogerlos en edición.
     */
    title_es?: string;

    /**
     * La descripción del libro en español. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_es?: string;

    /**
     * El título del libro en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    title_en?: string;

    /**
     * La descripción del libro en inglés. Es opcional, solo se usa para recogerlos en edición.
     */
    desc_en?: string;

    /**
     * La fecha en la que se creó el libro. Es opcional.
     */
    created_at?: Date;

    /**
     * La fecha en la que se actualizó el libro por última vez. Es opcional.
     */
    updated_at?: Date;
}
