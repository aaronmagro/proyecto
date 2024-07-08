import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComplexComponent } from '../../../shared/components/button-complex/button-complex.component';
import { ButtonComplexLinkComponent } from '../../../shared/components/button-complex-link/button-complex-link.component';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente `ForgotPasswordComponent`
 * 
 * Este componente permite a los usuarios solicitar un enlace para restablecer su contraseña.
 * 
 * @selector `app-forgot-password`
 * @imports `FontAwesomeModule`, `CommonModule`, `FormsModule`, `ButtonComplexComponent`, `ButtonComplexLinkComponent`, `TranslateModule`
 * @templateUrl `./forgot-password.component.html`
 * @styleUrl `./forgot-password.component.scss`
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ButtonComplexComponent,
    ButtonComplexLinkComponent,
    TranslateModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  userEmail: string = '';
  sent: boolean = false;
  emailDoesNotExists: boolean = false;

  /**
   * Constructor para inicializar el componente.
   * @param autenticacionService - Servicio de autenticación.
   * @param router - Router de Angular.
   * @param notification - Servicio de notificaciones.
   */
  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {}

  /**
   * Método `sendResetLink`
   * 
   * Envía un enlace para restablecer la contraseña al correo electrónico del usuario. Verifica si el correo
   * electrónico existe en la base de datos y maneja las respuestas del servidor adecuadamente.
   */
  sendResetLink() {
    if (this.userEmail === '' || this.userEmail === null) {
      this.notification.showWarning(this.translateService.instant('NOTIFICATIONS.FORGOT_PASSWORD.EMAIL_REQUIRED'), ''); // Fix here
    } else {
      this.autenticacionService.checkEmail(this.userEmail).subscribe({
        next: (response) => {
          if (response.exists) {
            this.autenticacionService.sendResetLink(this.userEmail).subscribe({
              next: (response) => {
                this.sent = true;
                this.notification.showSuccess(this.translateService.instant('NOTIFICATIONS.FORGOT_PASSWORD.LINK_SENT_SUCCESS'), ''); // Fix here
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 5000);
              },
              error: (error) => {
                this.notification.showError(this.translateService.instant('NOTIFICATIONS.FORGOT_PASSWORD.LINK_SENT_ERROR'), ''); // Fix here
              },
            });
          } else {
            this.notification.showWarning(this.translateService.instant('NOTIFICATIONS.FORGOT_PASSWORD.EMAIL_NOT_EXISTS'), ''); // Fix here
            this.emailDoesNotExists = true;
          }
        },
        error: (error) => {
          this.notification.showError(this.translateService.instant('NOTIFICATIONS.FORGOT_PASSWORD.RESET_LINK_ERROR'), ''); // Fix here
        },
      });
    }
  }
}
