import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subcategory } from '../../interfaces/subcategory';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {

  constructor(private http: HttpClient, private auth: AutenticacionService) {}

  private subcategoryUrl = `${environment.laravelBackendBaseUrl}/api/subcategory`;

  /**
   * Obtener las traducciones de una subcategoría específica.
   * @param subcategoryId - El ID de la subcategoría.
   * @returns Observable con las traducciones de la subcategoría.
   */
  showSubcategoryTranslations(subcategoryId: number): Observable<Subcategory> {
    const headers = this.getHeaders();
    return this.http.get<Subcategory>(`${this.subcategoryUrl}-translations/${subcategoryId}`, { headers });
  }

  /**
   * Guardar una nueva subcategoría.
   * @param name_es - Nombre en español.
   * @param name_en - Nombre en inglés.
   * @param desc_es - Descripción en español.
   * @param desc_en - Descripción en inglés.
   * @param category_id - ID de la categoría.
   * @returns Observable con la subcategoría guardada.
   */
  saveSubcategory(
    name_es?: string,
    name_en?: string,
    desc_es?: string,
    desc_en?: string,
    category_id?: number
  ): Observable<Subcategory> {
    const formData = new FormData();
    if (name_es) formData.append('name_es', name_es);
    if (name_en) formData.append('name_en', name_en);
    if (desc_es) formData.append('desc_es', desc_es);
    if (desc_en) formData.append('desc_en', desc_en);
    if (category_id) formData.append('category_id', category_id.toString());

    const headers = this.getHeaders();
    return this.http.post<Subcategory>(this.subcategoryUrl, formData, {headers});
  }

  private subcategoryUpdateUrl = `${environment.laravelBackendBaseUrl}/api/update-subcategory`;

  /**
   * Actualizar una subcategoría existente.
   * @param subcategory - La subcategoría a actualizar.
   * @param name_es - Nombre en español.
   * @param name_en - Nombre en inglés.
   * @param desc_es - Descripción en español.
   * @param desc_en - Descripción en inglés.
   * @param category_id - ID de la categoría.
   * @returns Observable con la subcategoría actualizada.
   */
  updateSubcategory(
    subcategory: Subcategory,
    name_es?: string,
    name_en?: string,
    desc_es?: string,
    desc_en?: string,
    category_id?: number
  ): Observable<Subcategory> {
    const formData = new FormData();
    formData.append('id', subcategory.id.toString());
    if (name_es) formData.append('name_es', name_es);
    if (name_en) formData.append('name_en', name_en);
    if (desc_es) formData.append('desc_es', desc_es);
    if (desc_en) formData.append('desc_en', desc_en);
    if (category_id) formData.append('category_id', category_id.toString());

    const headers = this.getHeaders();
    return this.http.post<Subcategory>(
      `${this.subcategoryUpdateUrl}/${subcategory.id}`, formData, {headers});
  }

  private subcategoryDeleteUrl = `${environment.laravelBackendBaseUrl}/api/destroy-subcategory`;

  /**
   * Eliminar una subcategoría por su ID.
   * @param catId - El ID de la subcategoría a eliminar.
   * @returns Observable con el resultado de la eliminación.
   */
  deleteSubcategory(catId: number): Observable<Subcategory> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.subcategoryDeleteUrl}/${catId}`, {}, {headers});
  }

  /**
   * Obtener los encabezados HTTP con el token de autenticación.
   * @returns HttpHeaders - Los encabezados con el token de autorización.
   */
  private getHeaders(): HttpHeaders {
    const token = this.auth.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
}
