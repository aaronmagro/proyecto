import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

/**
 * Servicio `TitleService`
 * 
 * Este servicio gestiona la actualización del título de la página basándose en la ruta activa y las traducciones de ngx-translate.
 */
@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

  /**
   * Inicializa el servicio para actualizar el título de la página según los cambios de navegación.
   */
  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      switchMap(data => {
        if (data['titleKey']) {
          return this.translate.get(data['titleKey']);
        } else {
          return this.translate.get('ROUTES.DEFAULT');
        }
      })
    ).subscribe((title: string) => {
      this.title.setTitle(title);
    });
  }

  /**
   * Actualiza el título de la página manualmente.
   */
  updateTitle() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.snapshot.data;
    if (data['titleKey']) {
      this.translate.get(data['titleKey']).subscribe((translatedTitle: string) => {
        this.title.setTitle(translatedTitle);
      });
    } else {
      this.translate.get('ROUTES.DEFAULT').subscribe((translatedTitle: string) => {
        this.title.setTitle(translatedTitle);
      });
    }
  }
}
