import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainLoaderComponent } from '../../shared/components/loaders/main-loader/main-loader.component';
import { BooksGalleryComponent } from '../../shared/components/books-gallery/books-gallery.component';
import { Book } from '../../interfaces/book';
import { TranslationService } from '../../shared/services/translation.service';
import { faAnglesLeft, faAnglesRight, faChevronDown, faChevronUp, faStar, faStarHalfAlt, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { faGoodreads, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

/**
 * Componente `HomeComponent`
 * 
 * Este componente es responsable de la página principal de la aplicación, donde se muestran los libros disponibles.
 * Permite a los usuarios buscar, filtrar, y ordenar los libros, así como ver detalles adicionales.
 * 
 * @selector `app-home`
 * @imports `CommonModule`, `FontAwesomeModule`, `MainLoaderComponent`, `BooksGalleryComponent`, `TranslateModule`, `FormsModule`, `RouterLink`
 * @templateUrl `./home.component.html`
 * @styleUrl `./home.component.scss`
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MainLoaderComponent,
    BooksGalleryComponent,
    TranslateModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  isbnFilter: string = '';
  sortOption: string = '';
  allBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalBooks = 0;
  isLoading = false;
  filtersVisible = false;
  Math = Math; // Acceso a las funciones matemáticas

  // Referencia al contenedor de la galería de libros
  @ViewChild('booksGalleryContainer') booksGalleryContainer!: ElementRef;

  /**
   * Constructor para inicializar el componente.
   * 
   * @param translationService - Servicio para manejar las traducciones.
   * @param library - Biblioteca de iconos de FontAwesome.
   */
  constructor(
    private translationService: TranslationService,
    library: FaIconLibrary
  ) {
    library.addIcons(faTwitter, faInstagram, faGoodreads, faStar, faStarHalfAlt, faAnglesLeft, faAnglesRight, faChevronDown, faChevronUp, faArrowDown);
  }

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   */
  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Carga los libros y configura el estado inicial del componente.
   */
  loadBooks(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe(translations => {
      if (Object.keys(translations).length > 0) {
        const nestedBooks = Object.values(this.translationService.libros);
        this.allBooks = nestedBooks.flatMap(book => Object.values(book))
          .filter(book => book.author === 'Aaron');
        this.totalBooks = this.allBooks.length;
        this.updatePage(this.currentPage);
        this.isLoading = false;
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Actualiza la página actual de la lista paginada de libros.
   * 
   * @param page - El número de página al que actualizar.
   */
  updatePage(page: number): void {
    this.currentPage = page;
    this.filterBooks();
  }

  /**
   * Alterna la visibilidad de las opciones de filtro.
   */
  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }

  /**
   * Ordena los libros filtrados en función de la opción de orden seleccionada.
   * 
   * @param filteredBooks - La lista de libros a ordenar.
   * @returns - La lista de libros ordenada.
   */
  sortBooks(filteredBooks: Book[]): Book[] {
    switch (this.sortOption) {
      case 'bestRated':
        return filteredBooks.sort((a, b) => b.average_rating - a.average_rating);
      case 'worstRated':
        return filteredBooks.sort((a, b) => a.average_rating - b.average_rating);
      case 'mostComments':
        return filteredBooks.sort((a, b) => b.comments_count - a.comments_count);
      case 'leastComments':
        return filteredBooks.sort((a, b) => a.comments_count - b.comments_count);
      default:
        return filteredBooks;
    }
  }

  /**
   * Maneja el evento de cambio de la opción de ordenación.
   * 
   * @param event - El evento activado al cambiar la opción de ordenación.
   */
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.filterBooks();
  }

  /**
   * Filtra la lista de libros según los términos de búsqueda, autor y ISBN.
   */
  filterBooks(): void {
    let filteredBooks = this.allBooks.filter(book =>
      (book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || book.desc.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.isbnFilter === '' || book.isbn.toLowerCase().includes(this.isbnFilter.toLowerCase()))
    );

    filteredBooks = this.sortBooks(filteredBooks);

    this.totalBooks = filteredBooks.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  }

  /**
   * Trunca la descripción de un libro a una longitud específica.
   * 
   * @param description - La descripción a truncar.
   * @returns - La descripción truncada.
   */
  truncateDescription(description: string): string {
    if (description.length > 200) {
      const truncatedDesc = description.slice(0, 200).trim();
      const lastSpaceIndex = truncatedDesc.lastIndexOf(' ');
      return truncatedDesc.slice(0, lastSpaceIndex) + '...';
    }
    return description;
  }

  /**
   * Obtiene las estrellas para la calificación del libro.
   * 
   * @param rating - La calificación del libro.
   * @returns - Un array que representa estrellas completas, medias y vacías.
   */
  getStars(rating: number): string[] {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push('full');
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  /**
   * Desplaza a la sección de la galería de libros.
   */
  scrollToGallery(): void {
    let navigatebutton = document.getElementById('navigate-button');
    if (this.booksGalleryContainer) {
      navigatebutton!.style.marginTop = '40px';
      navigatebutton!.style.visibility = 'hidden';
      this.booksGalleryContainer.nativeElement.classList.add('visible');
      this.booksGalleryContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
