import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AutenticacionService } from '../../services/autenticacion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = `${environment.laravelBackendBaseUrl}/api`;

  constructor(private http: HttpClient, private authService: AutenticacionService) {}

  /**
   * Obtiene las cabeceras HTTP incluyendo el token JWT para la autorización.
   * @returns HttpHeaders - Las cabeceras con el token de autorización.
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Obtiene todos los registros del servidor.
   * @returns Observable<any> - Un observable de los registros.
   */
  getLogs(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/logs`, { headers });
  }

  /**
   * Obtiene un registro específico por su ID.
   * @param id - El ID del registro a obtener.
   * @returns Observable<any> - Un observable del registro.
   */
  getLog(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/logs/${id}`, { headers });
  }

  /**
   * Elimina un registro específico por su ID.
   * @param id - El ID del registro a eliminar.
   * @returns Observable<any> - Un observable de la operación de eliminación.
   */
  deleteLog(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/destroy-logs/${id}`, {}, { headers });
  }

  /**
   * Elimina todos los registros del servidor.
   * @returns Observable<any> - Un observable de la operación de eliminación.
   */
  deleteAllLogs(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/destroy-all-logs`, {}, { headers });
  }
}
