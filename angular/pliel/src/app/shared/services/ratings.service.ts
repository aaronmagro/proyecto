import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../../services/autenticacion.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  
  private ratingUrl = `${environment.laravelBackendBaseUrl}/api/ratings`;

  constructor(private http: HttpClient, private auth: AutenticacionService) {}

  /**
   * Obtener los encabezados HTTP con el token de autenticación.
   * @returns - Los encabezados HTTP con el token de autorización.
   */
  getHeaders() {
    const token = this.auth.getJwtToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Enviar una valoración para un libro específico.
   * @param bookId - El ID del libro.
   * @param rating - La valoración a enviar.
   * @returns - Observable de la respuesta del servidor.
   */
  submitRating(bookId: number, rating: number): Observable<any> {
    return this.http.post(
      this.ratingUrl,
      { book_id: bookId, rating: rating },
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Obtener la valoración del usuario para un libro específico.
   * @param bookId - El ID del libro.
   * @returns - Observable de la valoración del usuario.
   */
  getRating(bookId: number): Observable<any> {
    return this.http.get(`${this.ratingUrl}/user/${bookId}`, {
      headers: this.getHeaders(),
    });
  }
}
