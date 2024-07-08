import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  constructor(private httpClient: HttpClient) {}

  private urlValidacionUsername: string = `${environment.laravelBackendBaseUrl}/api/check-username`;
  private urlValidacionEmail: string = `${environment.laravelBackendBaseUrl}/api/check-email`;

  /**
   * Verifica si el nombre de usuario está disponible.
   * @param username - El nombre de usuario a verificar.
   * @param userId - El ID del usuario actual (para excluirlo de la verificación).
   * @returns Observable<boolean> - Un observable que emite verdadero si el nombre de usuario está disponible.
   */
  isUsernameAvailable(username: string, userId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.urlValidacionUsername}/${username}/${userId}`);
  }

  /**
   * Verifica si el correo electrónico está disponible.
   * @param email - El correo electrónico a verificar.
   * @param userId - El ID del usuario actual (para excluirlo de la verificación).
   * @returns Observable<boolean> - Un observable que emite verdadero si el correo electrónico está disponible.
   */
  isEmailAvailable(email: string, userId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.urlValidacionEmail}/${email}/${userId}`);
  }
}
