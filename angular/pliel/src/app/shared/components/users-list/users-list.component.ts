import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { MatDialog } from '@angular/material/dialog';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { NotificationService } from '../../services/notification.service';
import jsPDF from 'jspdf';
import { UserService } from '../../services/user.service';
import { User } from '../../../interfaces/user';
import { ValidationService } from '../../services/validation.service';
import { TranslationService } from '../../services/translation.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { UserFormComponent } from '../user-form/user-form.component';

interface Column {
  field: string;
  header: string;
}

interface UserTableColumn {
  header: string;
  dataKey: keyof User;
}

/**
 * Componente para gestionar la lista de usuarios. Proporciona funcionalidades
 * para mostrar, filtrar, ordenar, editar, eliminar y exportar usuarios.
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MainLoaderComponent,
    TableModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    FormsModule,
    InputIconModule,
    ButtonModule,
    TranslateModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    UserFormComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ConfirmationService],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  selectedUser: User | null = null;
  isLoading = true;
  sortField: keyof User | '' = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchValue: string | undefined;
  showForm: boolean = false;
  originalUsers: { [id: number]: User } = {};

  activeOptions: any[] = [];
  blockedOptions: any[] = [];
  rolesOptions: any[] = [];

  cols: Column[];
  _selectedColumns: Column[];

  /**
   * Constructor del componente que inyecta los servicios necesarios.
   * @param dialog - Servicio de MatDialog para manejar modales.
   * @param confirmationService - Servicio de confirmación de PrimeNG.
   * @param notificationService - Servicio de notificaciones.
   * @param userService - Servicio para manejar usuarios.
   * @param validationService - Servicio para validar datos de usuarios.
   * @param translation - Servicio de traducción personalizado.
   * @param translate - Servicio de traducción de ngx-translate.
   * @param primengConfig - Configuración de PrimeNG.
   */
  constructor(
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private userService: UserService,
    private validationService: ValidationService,
    private translation: TranslationService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {
    this.cols = [
      { field: 'username', header: this.translate.instant('USERNAME') },
      { field: 'email', header: this.translate.instant('EMAIL') },
      { field: 'nombre', header: this.translate.instant('NAME') },
      { field: 'apellido1', header: this.translate.instant('SURNAME') },
      { field: 'apellido2', header: this.translate.instant('SECOND-SURNAME') },
      { field: 'activo', header: this.translate.instant('ACTIVE') },
      { field: 'bloqueado', header: this.translate.instant('BLOCKED') },
      { field: 'roles', header: this.translate.instant('ROLES') },
    ];
    this._selectedColumns = this.cols;
  }

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Carga los usuarios y las opciones de filtros y columnas.
   */
  ngOnInit(): void {
    this.loadUsers();
    this.updateOptions();
    this.translate.onLangChange.subscribe(() => {
      this.updateOptions();
      this.updateColumnHeaders();
      this.translate
        .get('primeng')
        .subscribe((res) => this.primengConfig.setTranslation(res));
    });
  }

  /**
   * Actualiza las opciones de filtros cuando el idioma cambia.
   */
  updateOptions(): void {
    this.activeOptions = [
      {
        label: this.translate.instant('ACTIVE'),
        value: true,
        icon: 'fa fa-thumbs-up text-success',
      },
      {
        label: this.translate.instant('INACTIVE'),
        value: false,
        icon: 'fa fa-thumbs-down text-danger',
      },
    ];

    this.blockedOptions = [
      {
        label: this.translate.instant('BLOCKED'),
        value: true,
        icon: 'fa fa-lock text-warning',
      },
      {
        label: this.translate.instant('UNBLOCKED'),
        value: false,
        icon: 'fa fa-unlock text-primary',
      },
    ];

    this.rolesOptions = [
      {
        label: this.translate.instant('ADMIN'),
        value: 'ROLE_ADMIN',
        icon: 'fa fa-shield-alt text-danger',
      },
      {
        label: this.translate.instant('USER'),
        value: 'ROLE_USER',
        icon: 'fa fa-user text-primary',
      },
    ];
  }

  /**
   * Actualiza los encabezados de las columnas cuando el idioma cambia.
   */
  updateColumnHeaders(): void {
    this.cols = [
      { field: 'username', header: this.translate.instant('USERNAME') },
      { field: 'email', header: this.translate.instant('EMAIL') },
      { field: 'nombre', header: this.translate.instant('NAME') },
      { field: 'apellido1', header: this.translate.instant('SURNAME') },
      { field: 'apellido2', header: this.translate.instant('SECOND-SURNAME') },
      { field: 'activo', header: this.translate.instant('ACTIVE') },
      { field: 'bloqueado', header: this.translate.instant('BLOCKED') },
      { field: 'roles', header: this.translate.instant('ROLES') },
    ];
    this._selectedColumns = this.cols;
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    // Restaura el orden original
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  /**
   * Carga los usuarios desde el servicio y actualiza la tabla.
   */
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = [...this.users];
      this.isLoading = false;
    });
  }

  /**
   * Aplica un filtro global a la tabla de usuarios.
   * @param event - Evento de entrada.
   */
  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();

    this.filteredUsers = this.users.filter((user) => {
      return (
        user.username.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.nombre.toLowerCase().includes(value) ||
        user.apellido1?.toLowerCase().includes(value) ||
        user.apellido2?.toLowerCase().includes(value)
      );
    });
  }

  /**
   * Ordena la tabla según el campo especificado.
   * @param field - Campo por el cual ordenar.
   */
  sortTable(field: keyof User): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.filteredUsers = this.sortUsers(this.users, field, this.sortOrder);
  }

  /**
   * Ordena los usuarios según el campo y el orden especificado.
   * @param users - Lista de usuarios a ordenar.
   * @param field - Campo por el cual ordenar.
   * @param order - Orden (ascendente o descendente).
   * @returns - Lista de usuarios ordenada.
   */
  sortUsers(users: User[], field: keyof User, order: 'asc' | 'desc'): User[] {
    return users.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue == null || bValue == null) {
        return 0;
      }

      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  /**
   * Obtiene el icono de ordenación para la columna especificada.
   * @param field - Campo por el cual ordenar.
   * @returns - Icono de ordenación.
   */
  getSortIcon(field: keyof User): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }

  /**
   * Limpia el filtro global de la tabla.
   * @param table - Tabla de PrimeNG.
   */
  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
    this.filteredUsers = [...this.users];
  }

  /**
   * Inicializa la edición de un usuario.
   * @param user - Usuario a editar.
   */
  onRowEditInit(user: User): void {
    this.originalUsers[user.id!] = { ...user };
  }

  /**
   * Guarda los cambios realizados en un usuario.
   * @param user - Usuario con cambios a guardar.
   */
  onRowEditSave(user: User): void {
    this.verifyUserBeforeSave(user);
  }

  /**
   * Verifica la disponibilidad del nombre de usuario y el correo electrónico
   * antes de guardar los cambios en un usuario.
   * @param user - Usuario a verificar.
   */
  verifyUserBeforeSave(user: User): void {
    this.validationService
      .isUsernameAvailable(user.username, user.id!)
      .subscribe(
        (usernameAvailable) => {
          if (usernameAvailable == true) {
            this.validationService
              .isEmailAvailable(user.email, user.id!)
              .subscribe(
                (emailAvailable) => {
                  if (emailAvailable == true) {
                    this.saveUser(user);
                  } else {
                    this.notificationService.showError(
                      this.translate.instant('NOTIFICATIONS.USERS_LIST.EMAIL_ALREADY_EXISTS'),
                      ''
                    );
                    this.resetUserToOriginal(user);
                  }
                },
                (error) => {
                  this.notificationService.showError(
                    this.translate.instant('NOTIFICATIONS.USERS_LIST.ERROR_VALIDATING_EMAIL'),
                    ''
                  );
                  this.resetUserToOriginal(user);
                }
              );
          } else {
            this.notificationService.showError(
              this.translate.instant('NOTIFICATIONS.USERS_LIST.USERNAME_ALREADY_EXISTS'),
              ''
            );
            this.resetUserToOriginal(user);
          }
        },
        (error) => {
          this.notificationService.showError(
            this.translate.instant('NOTIFICATIONS.USERS_LIST.ERROR_VALIDATING_USERNAME'),
            ''
          );
          this.resetUserToOriginal(user);
        }
      );
  }

  /**
   * Restaura los valores originales de un usuario.
   * @param user - Usuario a restaurar.
   */
  resetUserToOriginal(user: User): void {
    const originalUser = this.originalUsers[user.id!];
    user.username = originalUser.username;
    user.email = originalUser.email;
    user.nombre = originalUser.nombre;
    user.apellido1 = originalUser.apellido1;
    user.apellido2 = originalUser.apellido2;
    user.activo = originalUser.activo;
    user.bloqueado = originalUser.bloqueado;
    user.roles = originalUser.roles;
  }

  /**
   * Guarda los cambios realizados en un usuario.
   * @param user - Usuario con cambios a guardar.
   */
  saveUser(user: User): void {
    this.userService.updateUser(user).subscribe(
      () => {
        this.notificationService.showSuccess(
          this.translate.instant('NOTIFICATIONS.USERS_LIST.USER_UPDATED'),
          ''
        );
        delete this.originalUsers[user.id!];
      },
      (error) => {
        this.notificationService.showError(
          this.translate.instant('NOTIFICATIONS.USERS_LIST.ERROR_UPDATING_USER'),
          ''
        );
        this.resetUserToOriginal(user);
      }
    );
  }

  /**
   * Cancela la edición de un usuario.
   * @param user - Usuario a cancelar la edición.
   * @param index - Índice del usuario en la lista.
   */
  onRowEditCancel(user: User, index: number): void {
    const originalUser = this.originalUsers[user.id!];
    if (originalUser) {
      this.users[index] = originalUser;
      this.resetUserToOriginal(user);
    }
  }

  /**
   * Confirma la eliminación de un usuario.
   * @param user - Usuario a eliminar.
   */
  confirmDelete(user: User) {
    if (user.id !== undefined) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'NOTIFICATIONS.USERS_LIST.DELETE_CONFIRMATION_MESSAGE',
          { username: user.username }
        ),
        header: this.translate.instant('NOTIFICATIONS.USERS_LIST.DELETE_CONFIRMATION'),
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteUser(user.id!);
        },
        reject: () => {
          this.notificationService.showInfo(
            this.translate.instant('NOTIFICATIONS.USERS_LIST.DELETE_CANCELLED'),
            ''
          );
        },
      });
    } else {
      this.notificationService.showError(
        this.translate.instant('NOTIFICATIONS.USERS_LIST.ERROR_DELETING_USER'),
        ''
      );
    }
  }

  /**
   * Confirma la eliminación de los usuarios seleccionados.
   */
  confirmDeleteSelectedUsers() {
    const selectedUserNames = this.selectedUsers
      .map((user) => user.username)
      .join(', ');

    this.confirmationService.confirm({
      message: this.translate.instant(
        'NOTIFICATIONS.USERS_LIST.DELETE_SELECTED_CONFIRMATION_MESSAGE',
        { selectedUserNames }
      ),
      header: this.translate.instant('NOTIFICATIONS.USERS_LIST.DELETE_CONFIRMATION'),
      icon: 'pi pi-info-circle',
      accept: () => {
        const userIds = this.selectedUsers
          .map((user) => user.id)
          .filter((id) => id !== undefined) as number[];
        userIds.forEach((id) => {
          this.deleteUser(id);
        });
        this.selectedUsers = [];
      },
      reject: () => {
        this.notificationService.showInfo(
          this.translate.instant('NOTIFICATIONS.USERS_LIST.DELETE_CANCELLED'),
          ''
        );
      },
    });
  }

  /**
   * Elimina un usuario.
   * @param id - ID del usuario a eliminar.
   */
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        this.loadUsers();
        this.notificationService.showSuccess(
          this.translate.instant('NOTIFICATIONS.USERS_LIST.USER_DELETED'),
          ''
        );
      },
      (error) => {
        this.notificationService.showError(
          this.translate.instant('NOTIFICATIONS.USERS_LIST.ERROR_DELETING_USER'),
          ''
        );
      }
    );
  }

  /**
   * Cierra el formulario de edición y recarga los usuarios.
   */
  onFormClose(): void {
    this.showForm = false;
    this.loadUsers();
  }

  /**
   * Abre el formulario para crear un nuevo usuario.
   */
  openNew(): void {
    if (this.showForm) {
      this.showForm = false;
    } else {
      this.selectedUser = null;
      this.showForm = true;
    }
  }

  /**
   * Exporta la lista de usuarios a un archivo PDF.
   */
  async exportUsers() {
    const doc = new jsPDF({ orientation: 'landscape', format: 'a2' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Users List', doc.internal.pageSize.getWidth() / 2, 20, {
      align: 'center',
    });

    const columns: UserTableColumn[] = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Username', dataKey: 'username' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Name', dataKey: 'nombre' },
      { header: 'Surname', dataKey: 'apellido1' },
      { header: 'Second Surname', dataKey: 'apellido2' },
      { header: 'Active', dataKey: 'activo' },
      { header: 'Blocked', dataKey: 'bloqueado' },
      { header: 'Roles', dataKey: 'roles' },
      { header: 'Ultimo Acceso', dataKey: 'ultimo_acceso' },
      { header: 'Created At', dataKey: 'created_at' },
      { header: 'Updated At', dataKey: 'updated_at' },
    ];

    const rows = await Promise.all(
      this.users.map(async (user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido1: user.apellido1,
        apellido2: user.apellido2,
        activo: user.activo,
        bloqueado: user.bloqueado,
        roles: user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'User',
        ultimo_acceso: user.ultimo_acceso,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }))
    );

    (doc as any).autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row: any) =>
        columns.map((col) => {
          if (col.dataKey === 'foto') {
            return ''; // Leave the image cell empty
          }
          return row[col.dataKey];
        })
      ),
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
        minCellHeight: 15,
        fillColor: [243, 234, 243],
      },
      headStyles: {
        fillColor: [132, 112, 131],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fillColor: [243, 234, 243],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [228, 212, 228],
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 37 }, // Username
        // 2: { cellWidth: 37 }, // Email
        3: { cellWidth: 37 }, // Name
        // 4: { cellWidth: 37 }, // Surname
        // 5: { cellWidth: 37 }, // Second Surname
        6: { cellWidth: 20 }, // Active
        7: { cellWidth: 20 }, // Blocked
        8: { cellWidth: 25 }, // Roles
        9: { cellWidth: 21 }, // Ultimo Acceso
        10: { cellWidth: 21 }, // Created At
        11: { cellWidth: 21 }, // Updated At
      },
      margin: { top: 20 },
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    printWindow?.addEventListener('load', function () {
      printWindow.print();
    });
  }

  /**
   * Abre el modal para mostrar la imagen del usuario.
   * @param user - Usuario cuya imagen se va a mostrar.
   */
  openImageModal(user: User): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        image: user.foto,
      },
    });
  }
}
