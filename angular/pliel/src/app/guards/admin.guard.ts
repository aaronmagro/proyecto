import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

/**
 * Guard `AdminGuard`
 * 
 * Este guard se utiliza para proteger las rutas que requieren que el usuario tenga el rol `ROLE_ADMIN`.
 * Si el usuario no tiene el rol requerido, será redirigido a una página no autorizada.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
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
    return this.autenticacionService.getRoles().pipe(
      map((roles) => {
        if (roles.includes('ROLE_ADMIN')) {
          return true; // Usuario tiene el rol ROLE_ADMIN, permitir el acceso
        } else {
          // Redirigir a una página no autorizada o mostrar un mensaje de error
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}
