import { Injectable } from '@angular/core';
import { AutenticacionService } from './autenticacion.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';

/**
 * Servicio `AuthInterceptorService`
 * 
 * Este servicio intercepta las peticiones HTTP para añadir el token JWT en las cabeceras, si está disponible.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    private autenticacionService: AutenticacionService
  ) {}

  /**
   * Intercepta las peticiones HTTP para añadir el token JWT en las cabeceras, si está disponible.
   * @param request - La petición HTTP.
   * @param next - El siguiente manipulador de la petición.
   * @returns `Observable<HttpEvent<any>>` La respuesta de la petición HTTP.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtiene el token JWT
    const token = this.autenticacionService.getJwtToken();

    // Define la petición
    let peticion: HttpRequest<any>;

    if (token != null) {
      // Si hay token, añade la cabecera de autorización
      peticion = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // Si no hay token, la petición pasa inalterada
      peticion = request;
    }

    // Pasa la petición al siguiente manipulador
    return next.handle(peticion);
  }
}
