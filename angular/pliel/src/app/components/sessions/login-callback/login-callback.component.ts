import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

/**
 * Componente `LoginCallbackComponent`
 * 
 * Este componente maneja la lógica después de que un usuario ha intentado autenticarse mediante un proveedor externo (Google)
 * Procesa los parámetros de la URL, maneja los errores de autenticación y realiza el inicio de sesión.
 * 
 * @selector `app-login-callback`
 * @imports `CommonModule`
 * @templateUrl `./login-callback.component.html`
 * @styleUrl `./login-callback.component.scss`
 */
@Component({
  selector: 'app-login-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent {

  constructor(
    private route: ActivatedRoute,
    private authService: AutenticacionService,
    private router: Router,
    private notification: NotificationService,
    private translateService: TranslateService
  ) { }

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   * Procesa los parámetros de la URL para manejar la autenticación externa.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const error = params['error'];

      if (error) {
        // Manejar errores de autenticación
        this.translateService.get('NOTIFICATIONS.AUTHENTICATION_ERROR').subscribe((res: string) => {
          this.notification.showError(error, res);
        });
        this.router.navigate(['/login']);
      } else if (accessToken) {
        // Iniciar sesión con el token de acceso
        this.authService.iniciarSesionExterna({ access_token: accessToken })
          .subscribe(success => {
            if (success) {
              this.translateService.get('NOTIFICATIONS.LOGIN_SUCCESS').subscribe((res: string) => {
                this.router.navigate(['/home']).then(() => {
                  window.location.reload();
                  this.notification.showSuccess(res, '');
                });
              });
            } else {
              this.translateService.get('NOTIFICATIONS.LOGIN_FAILED').subscribe((res: string) => {
                this.router.navigate(['/login']).then(() => {
                  this.notification.showError(res, '');
                });
              });
            }
          });
      } else {
        // Manejar caso donde no hay ni token ni error
        this.translateService.get('NOTIFICATIONS.INVALID_AUTH_PARAMETERS').subscribe((res: string) => {
          this.router.navigate(['/login']).then(() => {
            this.notification.showError(res, '');
          });
        });
      }
    });
  }

}
