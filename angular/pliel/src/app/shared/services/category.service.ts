import { Injectable } from '@angular/core';
import { Category } from '../../interfaces/category';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl = `${environment.laravelBackendBaseUrl}/api/category`;
  private categoryUpdateUrl = `${environment.laravelBackendBaseUrl}/api/update-category`;
  private categoryDeleteUrl = `${environment.laravelBackendBaseUrl}/api/destroy-category`;

  constructor(private http: HttpClient, private auth: AutenticacionService) { }

  /**
   * Obtiene las traducciones de una categoría específica.
   * @param categoryId - El ID de la categoría para obtener las traducciones.
   * @returns - Observable de las traducciones de la categoría.
   */
  showCategoryTranslations(categoryId: number): Observable<Category> {
    const headers = this.getHeaders();
    return this.http.get<Category>(`${this.categoryUrl}-translations/${categoryId}`, { headers });
  }

  /**
   * Guarda una nueva categoría.
   * @param name_es - Nombre en español opcional.
   * @param name_en - Nombre en inglés opcional.
   * @param desc_es - Descripción en español opcional.
   * @param desc_en - Descripción en inglés opcional.
   * @returns - Observable de la categoría guardada.
   */
  saveCategory(
    name_es?: string,
    name_en?: string,
    desc_es?: string,
    desc_en?: string
  ): Observable<Category> {
    const formData = new FormData();
    if (name_es) formData.append('name_es', name_es);
    if (name_en) formData.append('name_en', name_en);
    if (desc_es) formData.append('desc_es', desc_es);
    if (desc_en) formData.append('desc_en', desc_en);

    const headers = this.getHeaders();
    return this.http.post<Category>(this.categoryUrl, formData, { headers });
  }

  /**
   * Actualiza una categoría existente.
   * @param category - El objeto categoría con detalles actualizados.
   * @param name_es - Nombre actualizado en español opcional.
   * @param name_en - Nombre actualizado en inglés opcional.
   * @param desc_es - Descripción actualizada en español opcional.
   * @param desc_en - Descripción actualizada en inglés opcional.
   * @returns - Observable de la categoría actualizada.
   */
  updateCategory(
    category: Category,
    name_es?: string,
    name_en?: string,
    desc_es?: string,
    desc_en?: string
  ): Observable<Category> {
    const formData = new FormData();
    formData.append('id', category.id.toString());
    if (name_es) formData.append('name_es', name_es);
    if (name_en) formData.append('name_en', name_en);
    if (desc_es) formData.append('desc_es', desc_es);
    if (desc_en) formData.append('desc_en', desc_en);

    const headers = this.getHeaders();
    return this.http.post<Category>(`${this.categoryUpdateUrl}/${category.id}`, formData, { headers });
  }

  /**
   * Elimina una categoría por ID.
   * @param catId - El ID de la categoría a eliminar.
   * @returns - Observable del resultado de la eliminación.
   */
  deleteCategory(catId: number): Observable<Category> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.categoryDeleteUrl}/${catId}`, {}, { headers });
  }

  /**
   * Obtiene los encabezados HTTP para las solicitudes autenticadas.
   * @returns - HttpHeaders con el token de Autorización.
   */
  private getHeaders(): HttpHeaders {
    const token = this.auth.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

}
