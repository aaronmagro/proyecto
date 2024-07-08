import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../../../services/autenticacion.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../interfaces/user';
import { Router } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TermsModalComponent } from '../terms-modal/terms-modal.component';
import { ButtonComplexComponent } from '../../../shared/components/button-complex/button-complex.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente `RegisterComponent`
 * 
 * Este componente maneja la lógica y la interfaz de usuario para que los nuevos usuarios puedan registrarse en la aplicación.
 * 
 * @selector `app-register`
 * @imports `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `ButtonComplexComponent`, `TranslateModule`
 * @templateUrl `./register.component.html`
 * @styleUrl `./register.component.scss`
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComplexComponent,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {

  formulario: FormGroup = this.fb.group({
    id: [-1],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(75)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    apellido1: ['', [Validators.minLength(2), Validators.maxLength(25)]],
    apellido2: ['', [Validators.minLength(2), Validators.maxLength(25)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public validationService: ValidationService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private translate: TranslateService
  ) {}

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   */
  ngOnInit(): void {}

  /**
   * Método que se ejecuta al enviar el formulario de registro.
   * Realiza las validaciones necesarias y envía los datos al servicio de autenticación.
   */
  register() {
    if (this.formulario.valid) {
      const checkbox = document.getElementById('link-checkbox') as HTMLInputElement;
  
      if (!this.formulario.value.username) {
        this.translate.get('NOTIFICATIONS.USERNAME_REQUIRED').subscribe((res: string) => {
          this.notification.showWarning(res, '');
        });
        return;
      }
  
      if (!this.formulario.value.email) {
        this.translate.get('NOTIFICATIONS.EMAIL_REQUIRED').subscribe((res: string) => {
          this.notification.showWarning(res, '');
        });
        return;
      }
  
      this.autenticacionService.checkUsername(this.formulario.value.username).subscribe({
        next: (usernameResponse) => {
          if (usernameResponse.exists) {
            this.translate.get('NOTIFICATIONS.USERNAME_EXISTS').subscribe((res: string) => {
              this.notification.showWarning(res, '');
            });
          } else {
            this.autenticacionService.checkEmail(this.formulario.value.email).subscribe({
              next: (emailResponse) => {
                if (emailResponse.exists) {
                  this.translate.get('NOTIFICATIONS.EMAIL_EXISTS').subscribe((res: string) => {
                    this.notification.showWarning(res, '');
                  });
                } else {
                  if (this.formulario.value.password !== this.formulario.value.password2) {
                    this.translate.get('NOTIFICATIONS.PASSWORDS_NOT_MATCH').subscribe((res: string) => {
                      this.notification.showWarning(res, 'CUIDADO');
                    });
                  } else if (!checkbox.checked) {
                    this.translate.get('NOTIFICATIONS.TERMS_NOT_ACCEPTED').subscribe((res: string) => {
                      this.notification.showWarning(res, '');
                    });
                  } else {
                    const user: User = {
                      id: -1,
                      username: this.formulario.value.username,
                      email: this.formulario.value.email,
                      nombre: this.formulario.value.nombre,
                      apellido1: this.formulario.value.apellido1,
                      apellido2: this.formulario.value.apellido2,
                      password: this.formulario.value.password,
                      roles: ['ROLE_USER'],
                      activo: true,
                      bloqueado: false,
                      ultimo_acceso: new Date(),
                      created_at: new Date(),
                      updated_at: new Date(),
                    };
                    this.autenticacionService.register(user).subscribe(
                      (response: any) => {
                        this.translate.get('NOTIFICATIONS.REGISTER_SUCCESS').subscribe((res: string) => {
                          this.notification.showSuccess(res, '');
                          this.router.navigate(['/login']);
                        });
                      },
                      (error: any) => {
                        this.translate.get('NOTIFICATIONS.REGISTER_ERROR').subscribe((res: string) => {
                          this.notification.showError(res, '');
                        });
                      }
                    );
                  }
                }
              },
              error: (error) => {
                this.translate.get('NOTIFICATIONS.EMAIL_CHECK_ERROR').subscribe((res: string) => {
                  this.notification.showError(res, '');
                });
              },
            });
          }
        },
        error: (error) => {
          this.translate.get('NOTIFICATIONS.USERNAME_CHECK_ERROR').subscribe((res: string) => {
            this.notification.showError(res, '');
          });
        },
      });
    } else {
      this.showFormValidationErrors();
    }
  }

  /**
   * Método para mostrar errores de validación del formulario.
   */
  showFormValidationErrors() {
    const controls = this.formulario.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        const errors = controls[name].errors;
        this.translate.get(`PLACEHOLDERS.${name.toUpperCase()}`).subscribe((placeholder: string) => {
          if (errors?.['required']) {
            this.translate.get('VALIDATIONS.REQUIRED', { field: placeholder }).subscribe((res: string) => {
              this.notification.showWarning(res, '');
            });
          }
          if (errors?.['maxlength']) {
            this.translate.get('VALIDATIONS.MAXLENGTH', { field: placeholder }).subscribe((res: string) => {
              this.notification.showWarning(res, '');
            });
          }
          if (errors?.['minlength']) {
            this.translate.get('VALIDATIONS.MINLENGTH', { field: placeholder }).subscribe((res: string) => {
              this.notification.showWarning(res, '');
            });
          }
          if (errors?.['email']) {
            this.translate.get('VALIDATIONS.EMAIL', { field: placeholder }).subscribe((res: string) => {
              this.notification.showWarning(res, '');
            });
          }
        });
      }
    }
  }

  /**
   * Método para abrir el modal de términos y condiciones.
   */
  async openModal() {
    const dialogRef = this.dialog.open(TermsModalComponent, {
      width: '70%',
      panelClass: 'terms-modal',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.acceptedTerms) {
        const checkbox = document.getElementById(
          'link-checkbox'
        ) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
        }
      }
    });
  }
}
