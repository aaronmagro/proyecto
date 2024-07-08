import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComplexComponent } from '../../../shared/components/button-complex/button-complex.component';
import { ButtonComplexLinkComponent } from '../../../shared/components/button-complex-link/button-complex-link.component';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente `ResetPasswordComponent`
 * 
 * Este componente maneja la lógica y la interfaz de usuario para que los usuarios puedan restablecer su contraseña utilizando un token enviado a su correo electrónico.
 * 
 * @selector `app-reset-password`
 * @imports `FontAwesomeModule`, `CommonModule`, `FormsModule`, `ButtonComplexComponent`, `ButtonComplexLinkComponent`, `TranslateModule`
 * @templateUrl `./reset-password.component.html`
 * @styleUrl `./reset-password.component.scss`
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ButtonComplexComponent,
    ButtonComplexLinkComponent,
    TranslateModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {

  token: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {}

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   * Inicializa el componente obteniendo el token de la URL y el correo electrónico de los parámetros de consulta.
   */
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  /**
   * Método para restablecer la contraseña del usuario.
   * Verifica que las contraseñas coincidan y llama al servicio de autenticación para cambiar la contraseña.
   */
  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.translateService.get('NOTIFICATIONS.PASSWORDS_NOT_MATCH').subscribe((res: string) => {
        this.notification.showWarning(res, '');
      });
      return;
    }
    this.autenticacionService
      .resetPassword(
        this.token,
        this.email,
        this.newPassword,
        this.confirmPassword
      )
      .subscribe({
        next: (response) => {
          this.translateService.get('NOTIFICATIONS.RESET_SUCCESS').subscribe((res: string) => {
            this.notification.showSuccess(res, '');
            // Cierra la pestaña del navegador después de 5 segundos
            setTimeout(() => {
              window.close();
            }, 5000);
          });
        },
        error: (error) => {
          this.translateService.get('NOTIFICATIONS.RESET_ERROR').subscribe((res: string) => {
            this.notification.showError(res, '');
          });
        },
      });
  }
}
