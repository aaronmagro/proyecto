import { ApplicationConfig, enableProdMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from './../environments/environment';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/**
 * Fábrica para el cargador de traducciones HTTP.
 * @param http - Cliente HTTP.
 * @returns `TranslateHttpLoader` - El cargador de traducciones HTTP.
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/**
 * Habilita el modo de producción si la aplicación se ejecuta en un entorno de producción.
 */
if (environment.production) {
  enableProdMode();
}

/**
 * Configuración de la aplicación Angular.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Proveedores para el módulo de traducción, incluyendo el cargador HTTP.
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
     }
    })),
    // Proveedores para las animaciones y notificaciones.
    provideAnimations(),
    provideToastr(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    // Proveedor del interceptor de autenticación.
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    // Proveedor de animaciones asíncronas.
    provideAnimationsAsync(),
  ]
};
