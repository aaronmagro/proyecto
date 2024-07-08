import { Injectable } from '@angular/core';
import { Book } from '../../interfaces/book';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutenticacionService } from '../../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, private auth: AutenticacionService) { }

  private booksUrl = `${environment.laravelBackendBaseUrl}/api/books`;

  /**
   * Guarda un libro nuevo en el backend.
   * @param book - Objeto libro a guardar.
   * @param imageFile - Archivo de imagen opcional.
   * @param imageUrl - URL de imagen opcional.
   * @param title_es - Título en español opcional.
   * @param desc_es - Descripción en español opcional.
   * @param title_en - Título en inglés opcional.
   * @param desc_en - Descripción en inglés opcional.
   * @returns Observable<Book>
   */
  saveBook(
    book: Book,
    imageFile?: File,
    imageUrl?: string,
    title_es?: string,
    desc_es?: string,
    title_en?: string,
    desc_en?: string
  ): Observable<Book> {
    const formData = new FormData();
    formData.append('isbn', book.isbn);
    formData.append('author', book.author);
    formData.append('price', book.price.toString());
    formData.append('publisher', book.publisher);
    formData.append('language', book.language);
    formData.append('subcategory_id', book.subcategory_id.toString());
    formData.append('key_title', book.title);
    formData.append('key_description', book.desc);
    formData.append('average_rating', book.average_rating.toString());
    formData.append('rating_count', book.rating_count.toString());
    formData.append('comments_count', book.comments_count.toString());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageUrl) {
      formData.append('image_url', imageUrl);
    }

    if (title_es) formData.append('title_es', title_es);
    if (desc_es) formData.append('desc_es', desc_es);
    if (title_en) formData.append('title_en', title_en);
    if (desc_en) formData.append('desc_en', desc_en);

    const headers = this.getHeaders();
    return this.http.post<Book>(this.booksUrl, formData, { headers });
  }

  /**
   * Muestra un libro por su ID.
   * @param bookId - ID del libro.
   * @returns Observable<Book>
   */
  showBook(bookId: number): Observable<Book> {
    const headers = this.getHeaders();
    return this.http.get<Book>(`${this.booksUrl}/${bookId}`, { headers });
  }

  /**
   * Muestra las traducciones de un libro por su ID.
   * @param bookId - ID del libro.
   * @returns Observable<Book>
   */
  showBookTranslations(bookId: number): Observable<Book> {
    const headers = this.getHeaders();
    return this.http.get<Book>(`${this.booksUrl}-translations/${bookId}`, { headers });
  }

  private booksUpdateUrl = `${environment.laravelBackendBaseUrl}/api/update-books`;

  /**
   * Actualiza un libro existente.
   * @param book - Objeto libro a actualizar.
   * @param imageFile - Archivo de imagen opcional.
   * @param imageUrl - URL de imagen opcional.
   * @param title_es - Título en español opcional.
   * @param desc_es - Descripción en español opcional.
   * @param title_en - Título en inglés opcional.
   * @param desc_en - Descripción en inglés opcional.
   * @returns Observable<Book>
   */
  updateBook(
    book: Book,
    imageFile?: File,
    imageUrl?: string,
    title_es?: string,
    desc_es?: string,
    title_en?: string,
    desc_en?: string
  ): Observable<Book> {
    const formData = new FormData();
    formData.append('isbn', book.isbn);
    formData.append('author', book.author);
    formData.append('price', book.price.toString());
    formData.append('publisher', book.publisher);
    formData.append('language', book.language);
    formData.append('subcategory_id', book.subcategory_id.toString());
    formData.append('key_title', book.title);
    formData.append('key_description', book.desc);
    formData.append('average_rating', book.average_rating.toString());
    formData.append('rating_count', book.rating_count.toString());
    formData.append('comments_count', book.comments_count.toString());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageUrl) {
      formData.append('image_url', imageUrl);
    }

    if (title_es) formData.append('title_es', title_es);
    if (desc_es) formData.append('desc_es', desc_es);
    if (title_en) formData.append('title_en', title_en);
    if (desc_en) formData.append('desc_en', desc_en);

    const headers = this.getHeaders();
    return this.http.post<Book>(`${this.booksUpdateUrl}/${book.id}`, formData, { headers });
  }

  private booksDeleteUrl = `${environment.laravelBackendBaseUrl}/api/destroy-books`;

  /**
   * Elimina un libro por su ID.
   * @param bookId - ID del libro.
   * @returns Observable<any>
   */
  deleteBook(bookId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.booksDeleteUrl}/${bookId}`, {}, { headers });
  }

  /**
   * Obtiene los headers necesarios para las peticiones HTTP.
   * @returns HttpHeaders
   */
  private getHeaders(): HttpHeaders {
    const token = this.auth.getJwtToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
