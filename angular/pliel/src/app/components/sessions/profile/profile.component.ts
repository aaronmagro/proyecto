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
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageModalComponent } from '../../../shared/components/image-modal/image-modal.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { MainLoaderComponent } from '../../../shared/components/loaders/main-loader/main-loader.component';

/**
 * Componente `ProfileComponent`
 * 
 * Este componente maneja la lógica y la interfaz de usuario para que los usuarios puedan ver y editar su perfil,
 * cambiar su contraseña y eliminar su cuenta.
 * 
 * @selector `app-profile`
 * @imports `FontAwesomeModule`, `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `TranslateModule`, `MatTabsModule`, `MatListModule`, `MatIconModule`, `MatInputModule`, `MatButtonModule`, `MatDialogModule`, `ImageModalComponent`, `MainLoaderComponent`, `TranslateModule`
 * @templateUrl `./profile.component.html`
 * @styleUrl `./profile.component.scss`
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ImageModalComponent,
    MainLoaderComponent,
    TranslateModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  fotoFile: File | undefined;
  fotoFileName: string | undefined;
  selectedTab: string = 'profile';
  useFile: boolean = true;
  isLoading = false;

  constructor(
    private authService: AutenticacionService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido1: [''],
      apellido2: [''],
      password: ['', Validators.required],
      foto: [''],
      fotoUrl: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPasswordConfirmation: ['', Validators.required],
    });
  }

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   * Carga los datos del usuario y actualiza el formulario.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getDatosUsuario().subscribe(
      (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Método para seleccionar un archivo de foto.
   * 
   * @param event - El evento que contiene el archivo seleccionado.
   */
  onFileSelected(event: any): void {
    this.fotoFile = event.target.files[0];
    this.fotoFileName = this.fotoFile ? this.fotoFile.name : undefined;
  }

  /**
   * Método para actualizar el perfil del usuario.
   */
  updateProfile(): void {
    const { username, email, nombre, apellido1, apellido2, password, fotoUrl } = this.profileForm.value;
    const user: User = {
      username,
      email,
      nombre,
      apellido1,
      apellido2,
      password,
      foto: '',
      activo: false,
      bloqueado: false,
    };

    if (password) {
      this.authService.updateUser(user, password, this.fotoFile, fotoUrl).subscribe(
        (response) => {
          this.translateService.get('NOTIFICATIONS.PROFILE_UPDATED').subscribe((res: string) => {
            this.notification.showSuccess(res, '');
          });
          window.location.reload();
        },
        (error) => {
          this.translateService.get('NOTIFICATIONS.PASSWORD_INCORRECT').subscribe((res: string) => {
            this.notification.showError(res, '');
          });
        }
      );
    } else {
      this.translateService.get('NOTIFICATIONS.PASSWORD_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }
  }

  /**
   * Método para cambiar la contraseña del usuario.
   */
  changePassword(): void {
    const { currentPassword, newPassword, newPasswordConfirmation } = this.passwordForm.value;

    if (newPassword !== newPasswordConfirmation) {
      this.translateService.get('NOTIFICATIONS.PASSWORDS_NOT_MATCH').subscribe((res: string) => {
        this.notification.showWarning(res, '');
      });
      return;
    }

    this.authService.updatePassword(currentPassword, newPassword, newPasswordConfirmation).subscribe(
      (response) => {
        this.translateService.get('NOTIFICATIONS.PASSWORD_UPDATED').subscribe((res: string) => {
          this.notification.showSuccess(res, '');
        });
      },
      (error) => {
        this.translateService.get('NOTIFICATIONS.PASSWORD_INCORRECT').subscribe((res: string) => {
          this.notification.showError(res, '');
        });
      }
    );
  }

  /**
   * Método para eliminar la cuenta del usuario.
   */
  deleteAccount(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.deleteUser(result).subscribe(
          (response) => {
            this.translateService.get('NOTIFICATIONS.ACCOUNT_DELETED').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
            });
            setInterval(() => {
              this.router.navigate(['/home']).then(() => {
                this.authService.logout();
              });
            }, 2000);
          },
          (error) => {
            this.translateService.get('NOTIFICATIONS.PASSWORD_INCORRECT').subscribe((res: string) => {
              this.notification.showError(res, '');
            });
          }
        );
      }
    });
  }

  /**
   * Método para abrir un modal de imagen.
   */
  openImageModal(): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        image: this.user?.foto,
      },
    });
  }
}
