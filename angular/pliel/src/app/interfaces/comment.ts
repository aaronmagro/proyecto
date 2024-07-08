import { User } from './user';

/**
 * Interfaz `Comment`
 * 
 * Esta interfaz define la estructura de un objeto comentario utilizado en la aplicación.
 */
export interface Comment {
  /**
   * El identificador único del comentario.
   */
  id: number;

  /**
   * El identificador del libro al que pertenece el comentario.
   */
  book_id: number;

  /**
   * El identificador del usuario que realizó el comentario.
   */
  user_id: number;

  /**
   * El identificador del comentario padre. Es `null` si el comentario no es una respuesta a otro comentario.
   */
  parent_id: number | null;

  /**
   * El contenido del comentario.
   */
  comment_content: string;

  /**
   * La fecha y hora en la que se creó el comentario.
   */
  created_at: Date;

  /**
   * La fecha y hora en la que se actualizó el comentario por última vez.
   */
  updated_at: Date;

  /**
   * El usuario que realizó el comentario.
   */
  user: User;

  /**
   * Las respuestas al comentario.
   */
  replies: Comment[];
}
