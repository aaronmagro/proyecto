import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private usersUrl = `${environment.laravelBackendBaseUrl}/api/users`;

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) {}

  /**
   * Obtiene la lista de usuarios.
   * @returns Observable<User[]> - Una lista de usuarios.
   */
  getUsers(): Observable<User[]> {
    const token = this.autenticacionService.getJwtToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(this.usersUrl, { headers });
  }

  /**
   * Crea un nuevo usuario.
   * @param user - El objeto de usuario a crear.
   * @param imageFile - Opcional. Un archivo de imagen para el usuario.
   * @returns Observable<User> - El usuario creado.
   */
  createUser(user: User, imageFile?: File): Observable<User> {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('nombre', user.nombre);
    if (user.apellido1) formData.append('apellido1', user.apellido1);
    if (user.apellido2) formData.append('apellido2', user.apellido2);
    if (user.roles) formData.append('roles', user.roles.toString());
    formData.append('activo', user.activo ? '1' : '0');
    formData.append('bloqueado', user.bloqueado ? '1' : '0');

    if (imageFile) {
      formData.append('foto', imageFile);
    }

    const headers = this.getHeaders();
    return this.http.post<User>(this.usersUrl, formData, { headers });
  }

  private usersUpdateUrl = `${environment.laravelBackendBaseUrl}/api/update-users`;

  /**
   * Actualiza un usuario existente.
   * @param user - El objeto de usuario con los datos actualizados.
   * @returns Observable<User> - El usuario actualizado.
   */
  updateUser(user: User): Observable<User> {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('nombre', user.nombre);
    if (user.apellido1) formData.append('apellido1', user.apellido1);
    if (user.apellido2) formData.append('apellido2', user.apellido2);
    if (user.roles) formData.append('roles', user.roles.toString());
    formData.append('activo', user.activo ? '1' : '0');
    formData.append('bloqueado', user.bloqueado ? '1' : '0');

    const headers = this.getHeaders();
    return this.http.post<User>(`${this.usersUpdateUrl}/${user.id}`, formData, { headers });
  }

  private usersDeleteUrl = `${environment.laravelBackendBaseUrl}/api/destroy-users`;

  /**
   * Elimina un usuario por su ID.
   * @param id - El ID del usuario a eliminar.
   * @returns Observable<void> - Una respuesta vacía indicando la eliminación.
   */
  deleteUser(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.post<void>(`${this.usersDeleteUrl}/${id}`, {}, { headers });
  }

  /**
   * Obtiene los encabezados HTTP con el token de autenticación.
   * @returns HttpHeaders - Los encabezados con el token de autenticación.
   */
  private getHeaders(): HttpHeaders {
    const token = this.autenticacionService.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

}
