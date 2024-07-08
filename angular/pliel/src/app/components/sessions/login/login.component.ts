import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComplexComponent } from '../../../shared/components/button-complex/button-complex.component';
import { ButtonComplexLinkComponent } from '../../../shared/components/button-complex-link/button-complex-link.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente `LoginComponent`
 * 
 * Este componente maneja la lógica de inicio de sesión, permitiendo a los usuarios autenticarse mediante
 * credenciales o utilizando Google para autenticación externa.
 * 
 * @selector `app-login`
 * @imports `FontAwesomeModule`, `CommonModule`, `FormsModule`, `ButtonComplexComponent`, `ButtonComplexLinkComponent`, `TranslateModule`
 * @templateUrl `./login.component.html`
 * @styleUrl `./login.component.scss`
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ButtonComplexComponent,
    ButtonComplexLinkComponent,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
   * Credenciales de inicio de sesión del usuario.
   */
  credenciales = {
    login: '',
    pass: ''
  };

  /**
   * Observable para obtener los datos del usuario.
   */
  datosUsuario$: Observable<any> | undefined;

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    private notification: NotificationService
  ) { }

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   */
  ngOnInit() {
    this.datosUsuario$ = this.autenticacionService.getDatosUsuario();
  }

  /**
   * Método que se ejecuta al enviar el formulario de inicio de sesión.
   */
  login() {
    this.autenticacionService.iniciarSesion(this.credenciales.login, this.credenciales.pass)
    .subscribe({
      next: (autenticado: boolean) => {
        if (autenticado) {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          // El servicio de autenticación maneja el mensaje de error
        }
      },
      error: (error: any) => {
        // El servicio de autenticación maneja el mensaje de error
      }
    });
  }

  /**
   * Inicia sesión utilizando Google.
   * Redirige al usuario a la URL de Laravel para iniciar la autenticación con Google.
   */
  iniciarSesionConGoogle() {
    window.location.href = this.autenticacionService.loginUrlExterna;
  }
}
