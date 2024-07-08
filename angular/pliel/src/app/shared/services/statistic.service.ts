import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private apiUrl = `${environment.laravelBackendBaseUrl}/api`;

  constructor(private http: HttpClient, private authService: AutenticacionService) { }

  /**
   * Obtener las estadísticas del usuario.
   * @returns Observable con las estadísticas del usuario.
   */
  getUserStatistics(): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/user/statistics`, { headers });
  }
}
