import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

/**
 * Guard `LoggedGuard`
 * 
 * Este guard se utiliza para proteger las rutas que requieren que el usuario haya iniciado sesión.
 * Si el usuario no ha iniciado sesión, será redirigido a la página de login.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {}

  /**
   * Método que determina si se puede activar una ruta.
   * 
   * @param next - Siguiente `ActivatedRouteSnapshot`.
   * @param state - Estado actual `RouterStateSnapshot`.
   * @returns `Observable<boolean>` indicando si la ruta puede ser activada.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return of(this.autenticacionService.isSesionIniciada()).pipe(
      map((isLogged) => {
        if (isLogged) {
          return true; // Usuario ha iniciado sesión, permitir el acceso
        } else {
          // Redirigir a la página de login
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
