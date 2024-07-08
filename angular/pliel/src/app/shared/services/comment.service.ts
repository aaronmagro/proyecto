import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Comment } from '../../interfaces/comment';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = `${environment.laravelBackendBaseUrl}/api/books`;
  private commentAddedSource = new Subject<void>();

  commentAdded$ = this.commentAddedSource.asObservable();

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) { }

  /**
   * Obtiene todos los comentarios de un libro específico.
   * @param bookId - El ID del libro.
   * @returns Observable<Comment[]> - Un flujo observable de comentarios.
   */
  getComments(bookId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${bookId}/comments`);
  }

  /**
   * Añade un nuevo comentario a un libro específico.
   * @param bookId - El ID del libro.
   * @param comment - Los datos del comentario a añadir.
   * @returns Observable<Comment> - Un flujo observable del comentario añadido.
   */
  addComment(bookId: number, comment: { comment_content: string, parent_id?: number | null }): Observable<Comment> {
    const token = this.autenticacionService.getJwtToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Comment>(`${this.apiUrl}/${bookId}/comments`, comment, { headers }).pipe(
      tap(() => this.commentAddedSource.next())
    );
  }

  /**
   * Elimina un comentario específico de un libro.
   * @param bookId - El ID del libro.
   * @param commentId - El ID del comentario a eliminar.
   * @returns Observable<void> - Un flujo observable del resultado de la eliminación.
   */
  deleteComment(bookId: number, commentId: number): Observable<void> {
    const token = this.autenticacionService.getJwtToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/${bookId}/comments/${commentId}`, {}, { headers }).pipe(
      tap(() => this.commentAddedSource.next())
    );
  }

}
