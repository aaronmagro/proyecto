import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../interfaces/auth';
import { User } from '../interfaces/user';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Servicio `AutenticacionService`
 * 
 * Este servicio proporciona métodos para manejar la autenticación del usuario, incluyendo inicio y cierre de sesión, registro, y gestión de perfiles.
 */
@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  // URLs para las diferentes acciones de autenticación
  private loginUrl: string = `${environment.laravelBackendBaseUrl}/api/login`;
  private logoutUrl: string = `${environment.laravelBackendBaseUrl}/api/logout`;
  public loginUrlExterna: string = `${environment.laravelBackendBaseUrl}/api/login-google`;
  private registerUrl = `${environment.laravelBackendBaseUrl}/api/register`;
  private forgotPasswordUrl = `${environment.laravelBackendBaseUrl}/api/forgot-password`;
  private resetPasswordUrl = `${environment.laravelBackendBaseUrl}/api/reset-password`;
  private profileUrl = `${environment.laravelBackendBaseUrl}/api/user`;

  // Token JWT y datos del usuario autenticado
  private jwtToken: string | null = null;
  private roles: string[] = [];
  private username: string | null = null;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService,
    private translateService: TranslateService
  ) {}

  /**
   * Inicia sesión con las credenciales proporcionadas.
   * @param login - El nombre de usuario.
   * @param pass - La contraseña.
   * @returns `Observable<boolean>` indicando si la autenticación fue exitosa.
   */
  iniciarSesion(login: string, pass: string): Observable<boolean> {
    const credenciales: LoginRequest = {
      username: login,
      password: pass,
    };

    return this.httpClient
      .post<LoginResponse>(this.loginUrl, credenciales)
      .pipe(
        map((response) => {
          if (response && response.access_token) {
            this.jwtToken = response.access_token;
            localStorage.setItem('jwtToken', response.access_token);
            return true;
          } else {
            throw new Error('Credenciales inválidas');
          }
        }),
        catchError((error: any) => {
          this.handleLoginError(error);
          return of(false);
        })
      );
  }

  /**
   * Maneja el inicio de sesión externo (por ejemplo, con Google).
   * @param data - Los datos de autenticación.
   * @returns `Observable<boolean>` indicando si la autenticación fue exitosa.
   */
  iniciarSesionExterna(data: { access_token: string }): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      this.jwtToken = data.access_token;
      localStorage.setItem('jwtToken', data.access_token);
    }
    return of(true);
  }

  /**
   * Verifica si hay una sesión iniciada.
   * @returns `boolean` indicando si la sesión está iniciada.
   */
  isSesionIniciada(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwtToken');
    } else {
      return false;
    }
  }

  /**
   * Obtiene el token JWT del usuario autenticado.
   * @returns `string | null` El token JWT.
   */
  getJwtToken(): string | null {
    if (!this.jwtToken) {
      this.jwtToken = localStorage.getItem('jwtToken');
    }
    return this.jwtToken;
  }

  /**
   * Obtiene los roles del usuario autenticado.
   * @returns `Observable<string[]>` Los roles del usuario.
   */
  getRoles(): Observable<string[]> {
    const token = this.getJwtToken();
    if (!token) {
      return of([]);
    }

    return this.httpClient.get<string[]>(`${this.loginUrl}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Obtiene los datos del usuario autenticado.
   * @returns `Observable<User>` Los datos del usuario.
   */
  getDatosUsuario(): Observable<User> {
    const jwtToken = isPlatformBrowser(this.platformId) ? localStorage.getItem('jwtToken') ?? '' : '';
    if (!jwtToken) {
      return of({} as User);
    }
    return this.httpClient.get<User>(`${this.loginUrl}/info`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  }

  /**
   * Cierra la sesión del usuario.
   * @returns `Promise<void>` indicando el resultado de la operación.
   */
  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(this.logoutUrl, {}, {
        headers: {
          Authorization: `Bearer ${this.getJwtToken()}`,
        },
      }).subscribe(
        () => {
          this.clearSession();
          this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.SESSION_CLOSED').subscribe((res: string) => {
            this.notification.showSuccess(res, this.translateService.instant('NOTIFICATIONS.LOGIN_ERROR.GOODBYE'));
          });
          resolve();
        },
        (error) => {
          this.clearSession();
          console.error('Error al cerrar sesión', error);
          reject(error);
        }
      );
    });
  }
  
  /**
   * Limpia los datos de la sesión actual.
   */
  private clearSession() {
    localStorage.removeItem('jwtToken');
    this.jwtToken = null;
  }

  /**
   * Registra un nuevo usuario.
   * @param user - Los datos del usuario.
   * @returns `Observable<any>` indicando el resultado del registro.
   */
  register(user: User): Observable<any> {
    return this.httpClient.post(this.registerUrl, user);
  }

  /**
   * Envía un enlace para restablecer la contraseña al correo electrónico proporcionado.
   * @param email - El correo electrónico del usuario.
   * @returns `Observable<any>` indicando el resultado de la operación.
   */
  sendResetLink(email: string): Observable<any> {
    return this.httpClient.post(this.forgotPasswordUrl, { email });
  }

  /**
   * Restablece la contraseña del usuario.
   * @param token - El token de restablecimiento.
   * @param email - El correo electrónico del usuario.
   * @param password - La nueva contraseña.
   * @param password_confirmation - La confirmación de la nueva contraseña.
   * @returns `Observable<any>` indicando el resultado de la operación.
   */
  resetPassword(
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Observable<any> {
    return this.httpClient.post(this.resetPasswordUrl, {
      token,
      email,
      password,
      password_confirmation,
    });
  }

  /**
   * Comprueba si el correo electrónico proporcionado ya está registrado.
   * @param email - El correo electrónico a verificar.
   * @returns `Observable<any>` indicando si el correo electrónico existe.
   */
  checkEmail(email: string): Observable<any> {
    return this.httpClient.post(`${environment.laravelBackendBaseUrl}/api/check-email`, { email });
  }

  /**
   * Comprueba si el nombre de usuario proporcionado ya está registrado.
   * @param username - El nombre de usuario a verificar.
   * @returns `Observable<any>` indicando si el nombre de usuario existe.
   */
  checkUsername(username: string): Observable<any> {
    return this.httpClient.post(`${environment.laravelBackendBaseUrl}/api/check-username`, { username });
  }

  /**
   * Actualiza los datos del usuario.
   * @param user - Los datos del usuario.
   * @param password - La contraseña actual del usuario.
   * @param fotoFile - El archivo de la foto del usuario.
   * @param fotoUrl - La URL de la foto del usuario.
   * @returns `Observable<any>` indicando el resultado de la operación.
   */
  updateUser(
    user: User,
    password: string,
    fotoFile?: File,
    fotoUrl?: string
  ): Observable<any> {
    const token = this.getJwtToken();

    const formData: FormData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('nombre', user.nombre);
    if (user.apellido1) formData.append('apellido1', user.apellido1);
    if (user.apellido2) formData.append('apellido2', user.apellido2);
    formData.append('password', password);
    if (fotoFile) formData.append('foto', fotoFile);
    if (fotoUrl) formData.append('foto_url', fotoUrl);

    return this.httpClient.post(`${this.profileUrl}/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Actualiza la contraseña del usuario.
   * @param currentPassword - La contraseña actual del usuario.
   * @param newPassword - La nueva contraseña.
   * @param newPasswordConfirmation - La confirmación de la nueva contraseña.
   * @returns `Observable<any>` indicando el resultado de la operación.
   */
  updatePassword(
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Observable<any> {
    const token = this.getJwtToken();
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    return this.httpClient.post(`${this.profileUrl}/update-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Elimina la cuenta del usuario.
   * @param password - La contraseña del usuario.
   * @returns `Observable<any>` indicando el resultado de la operación.
   */
  deleteUser(password: string): Observable<any> {
    const token = this.getJwtToken();
    return this.httpClient.post(
      `${this.profileUrl}/delete-profile`,
      { password: password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  /**
   * Maneja los errores que pueden ocurrir durante el inicio de sesión.
   * @param error - El error ocurrido.
   */
  private handleLoginError(error: any): void {
    if (error.status === 429) {
      this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.TOO_MANY_ATTEMPTS').subscribe((res: string) => {
        this.notification.showError(error.error.message || res, this.translateService.instant('NOTIFICATIONS.LOGIN_ERROR.TOO_MANY_ATTEMPTS'));
      });
    } else if (error.status === 403) {
      if (error.error && error.error.message === 'Usuario bloqueado') {
        this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.USER_BLOCKED').subscribe((res: string) => {
          this.notification.showError(res, '');
        });
      } else if (error.error && error.error.message === 'Usuario inactivo') {
        this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.USER_INACTIVE').subscribe((res: string) => {
          this.notification.showError(res, '');
        });
      }
    } else if (error.status === 401) {
      this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.INVALID_CREDENTIALS').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    } else {
      this.translateService.get('NOTIFICATIONS.LOGIN_ERROR.UNKNOWN_ERROR').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }
  }
}
