import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Servicio `RouteTitleResolver`
 * 
 * Este servicio resuelve el título de una ruta utilizando ngx-translate para traducir el título basado en la clave proporcionada en los datos de la ruta.
 */
@Injectable({
  providedIn: 'root'
})
export class RouteTitleResolver implements Resolve<string> {
  constructor(private translate: TranslateService) {}

  /**
   * Resuelve el título de la ruta utilizando la clave de título proporcionada en los datos de la ruta.
   * @param route - La instantánea de la ruta activada.
   * @param state - El estado del router.
   * @returns `Observable<string>` El título traducido de la ruta.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const titleKey = route.data['titleKey'];
    return this.translate.get(titleKey).pipe(
      map(translatedTitle => translatedTitle)
    );
  }
}
