import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Translation } from '../../interfaces/translation';
import { environment } from '../../../environments/environment';
import { Book } from '../../interfaces/book';
import { Subcategory } from '../../interfaces/subcategory';
import { Category } from '../../interfaces/category';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /**
   * Un BehaviorSubject que contiene las traducciones actuales.
   */
  public translations$: BehaviorSubject<Translation> = new BehaviorSubject<Translation>({});
  /**
   * Un Observable que emite las traducciones actuales.
   */
  public translations: Observable<Translation> = this.translations$.asObservable();

  public libros: { [key: string]: Book } = {};
  public categorias: { [key: string]: Category } = {};
  public subcategorias: { [key: string]: Subcategory } = {};

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Carga las traducciones para el idioma especificado.
   * @param language El idioma para el que se cargarán las traducciones.
   */
  loadTranslations(language: string): void {
    const url = `${environment.laravelBackendBaseUrl}/api/translations/${language}`;
    this.http
      .get<any>(url)
      .pipe(map((data: any) => this.flattenTranslations(data)))
      .subscribe(
        (translations) => {
          this.translations$.next(translations);
          localStorage.setItem('lang', language);
          localStorage.setItem('translations', JSON.stringify(translations));

          Object.keys(translations).forEach((key) => {
            if (key.startsWith('books')) {
              const booksData = translations[key];
              if (typeof booksData === 'object') {
                this.libros[key] = booksData as Book;
              } else {
                console.error(`Error: Los datos de ${key} no coinciden con el tipo de Book`);
              }
            } else if (key.startsWith('categories')) {
              const categoriesData = translations[key];
              if (typeof categoriesData === 'object') {
                this.categorias[key] = categoriesData as Category;
              } else {
                console.error(`Error: Los datos de ${key} no coinciden con el tipo de Category`);
              }
            } else if (key.startsWith('subcategories')) {
              const subcategoriesData = translations[key];
              if (typeof subcategoriesData === 'object') {
                this.subcategorias[key] = subcategoriesData as Subcategory;
              } else {
                console.error(`Error: Los datos de ${key} no coinciden con el tipo de Subcategory`);
              }
            }
          });
        },
        (error) => {
          console.error('Error al cargar las traducciones', error);
        }
      );
  }

  /**
   * Aplana las traducciones recibidas desde el servidor.
   * @param data Los datos de traducción sin procesar.
   * @returns Un objeto de traducción aplanado.
   */
  private flattenTranslations(data: any): Translation {
    const translations: Translation = {};
    Object.keys(data).forEach((key) => {
      translations[key] = data[key];
    });
    return translations;
  }

  /**
   * Obtiene el idioma actual del almacenamiento local.
   * @returns El idioma actual.
   */
  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('lang') || 'es';
    }
    return 'es';
  }

  /**
   * Carga las traducciones para el idioma actual.
   */
  loadLanguage(): void {
    const lang = this.getCurrentLanguage();
    this.loadTranslations(lang);
  }

  /**
   * Obtiene la información de un libro por su ID.
   * @param bookId El ID del libro.
   * @returns Un objeto que contiene el libro y su subcategoría.
   */
  getInfoBook(bookId: number): { book: Book | undefined; subcategory: Subcategory | undefined } {
    const translationsString = localStorage.getItem('translations');
    if (translationsString) {
      const translations = JSON.parse(translationsString);
      const libros: { [key: string]: Book } = translations['books'];
      const subcategorias: { [key: string]: Subcategory } = translations['subcategories'];

      let book: Book | undefined;
      let subcategory: Subcategory | undefined;

      for (const key in libros) {
        const libro = libros[key];
        if (libros.hasOwnProperty(key)) {
          if (libro.id === bookId) {
            book = libro;
            if (libro.subcategory_id && subcategorias[libro.subcategory_id]) {
              subcategory = subcategorias[libro.subcategory_id];
            }
            break;
          }
        }
      }

      return { book, subcategory };
    }
    return { book: undefined, subcategory: undefined };
  }

  /**
   * Obtiene una subcategoría por su ID.
   * @param subcategoryId El ID de la subcategoría.
   * @returns Un objeto que contiene la subcategoría y los libros que pertenecen a ella.
   */
  getSubcategoryById(subcategoryId: number): { subcategory: Subcategory; books: Book[] } | undefined {
    const translationsString = localStorage.getItem('translations');
    if (translationsString) {
      const translations = JSON.parse(translationsString);
      const subcategorias: { [key: string]: Subcategory } = translations['subcategories'];
      const libros: { [key: string]: Book } = translations['books'];

      let subcategory: Subcategory | undefined;
      let books: Book[] = [];

      for (const key in subcategorias) {
        const subcat = subcategorias[key];
        if (subcategorias.hasOwnProperty(key)) {
          if (subcat.id === subcategoryId) {
            subcategory = subcat;
            books = Object.values(libros).filter(
              (book) => book.subcategory_id === subcat.id
            );
            break;
          }
        }
      }

      return { subcategory: subcategory as Subcategory, books };
    }
    return undefined;
  }
}
