import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { User } from '../../../interfaces/user';

/**
 * Componente para manejar el formulario de usuarios, permite crear nuevos usuarios.
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLoaderComponent,
    AngularEditorModule,
    TranslateModule,
    DropdownModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Output() formClose = new EventEmitter<void>();
  userForm: FormGroup;
  isLoading = false;
  roles: any[] = [];
  selectedTab = 'user';

  /**
   * Constructor del componente que inyecta los servicios necesarios.
   * @param fb - Servicio de FormBuilder para crear formularios reactivos.
   * @param notification - Servicio de notificaciones.
   * @param userService - Servicio para manejar usuarios.
   * @param translate - Servicio de traducción para manejar idiomas.
   */
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido1: [''],
      apellido2: [''],
      roles: [[], Validators.required],
      activo: [true, Validators.required],
      bloqueado: [false, Validators.required],
    });
  }

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Carga los roles y configura las traducciones.
   */
  ngOnInit(): void {
    this.roles = [
      { label: this.translate.instant('USER'), value: 'ROLE_USER' },
      { label: this.translate.instant('ADMIN'), value: 'ROLE_ADMIN' }
    ];

    this.translate.onLangChange.subscribe(() => {
      this.roles = [
        { label: this.translate.instant('USER'), value: 'ROLE_USER' },
        { label: this.translate.instant('ADMIN'), value: 'ROLE_ADMIN' }
      ];
    });
  }

  /**
   * Guarda un nuevo usuario si el formulario es válido.
   */
  saveUser(): void {
    if (this.userForm.invalid) {
      this.notification.showWarning(this.translate.instant('NOTIFICATIONS.USER_FORM.FILL_REQUIRED_FIELDS'), '');
      return;
    }

    const user: User = this.userForm.value;

    this.isLoading = true;

    this.userService.createUser(user).subscribe(
      (response) => {
        this.notification.showSuccess(this.translate.instant('NOTIFICATIONS.USER_FORM.USER_CREATED_SUCCESSFULLY'), '');
        this.formClose.emit();
        this.isLoading = false;
      },
      (error) => {
        this.notification.showError(this.translate.instant('NOTIFICATIONS.USER_FORM.FAILED_CREATE_USER'), '');
        this.isLoading = false;
      }
    );
  }
}
