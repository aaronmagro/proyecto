import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Book } from '../../../interfaces/book';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComplexComponent } from '../button-complex/button-complex.component';
import { ButtonComplexLinkComponent } from '../button-complex-link/button-complex-link.component';
import { faSearch, faStar, faStarHalfAlt, faAnglesLeft, faAnglesRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonSimpleComponent } from '../button-simple/button-simple.component';
import { RatingsComponent } from '../ratings/ratings.component';

/**
 * Componente `BooksGalleryComponent`
 * 
 * Este componente muestra una galería de libros disponibles, permitiendo a los usuarios buscar, filtrar y ordenar los libros.
 * 
 * @selector `app-books-gallery`
 * @imports `FontAwesomeModule`, `CommonModule`, `MainLoaderComponent`, `RouterLink`, `FormsModule`, `TranslateModule`, `ButtonComplexComponent`, `ButtonComplexLinkComponent`, `ButtonSimpleComponent`, `RatingsComponent`
 * @templateUrl `./books-gallery.component.html`
 * @styleUrl `./books-gallery.component.scss`
 * @standalone
 */
@Component({
  selector: 'app-books-gallery',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    MainLoaderComponent,
    RouterLink,
    FormsModule,
    TranslateModule,
    ButtonComplexComponent,
    ButtonComplexLinkComponent,
    ButtonSimpleComponent,
    RatingsComponent
  ],
  templateUrl: './books-gallery.component.html',
  styleUrl: './books-gallery.component.scss',
})
export class BooksGalleryComponent implements OnInit {
  searchTerm: string = '';
  authorFilter: string = '';
  isbnFilter: string = '';
  sortOption: string = '';
  allBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalBooks = 0;
  isLoading = false;
  Math = Math;

  filtersVisible = false;

  constructor(private translationService: TranslationService, library: FaIconLibrary) {
    library.addIcons(faSearch, faStar, faStarHalfAlt, faAnglesLeft, faAnglesRight, faChevronUp, faChevronDown);
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Carga los libros disponibles y actualiza el estado del componente.
   */
  loadBooks(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe(translations => {
      if (Object.keys(translations).length > 0) {
        const nestedBooks = Object.values(this.translationService.libros);
        this.allBooks = nestedBooks.flatMap(book => Object.values(book));
        this.totalBooks = this.allBooks.length;
        this.updatePage(this.currentPage);
        this.isLoading = false;
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Actualiza la página actual de la lista de libros paginados.
   * @param page - El número de página a mostrar.
   */
  updatePage(page: number): void {
    this.currentPage = page;
    this.filterBooks();
  }

  /**
   * Alterna la visibilidad de los filtros de búsqueda.
   */
  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }

  /**
   * Ordena los libros filtrados según la opción seleccionada.
   * @param filteredBooks - La lista de libros filtrados a ordenar.
   * @returns - La lista de libros ordenados.
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
   * Maneja el cambio de la opción de ordenación.
   * @param event - El evento de cambio.
   */
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.filterBooks();
  }

  /**
   * Filtra los libros según los términos de búsqueda y los filtros aplicados.
   */
  filterBooks(): void {
    let filteredBooks = this.allBooks.filter(book =>
      (book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || book.desc.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.authorFilter === '' || book.author.toLowerCase().includes(this.authorFilter.toLowerCase())) &&
      (this.isbnFilter === '' || book.isbn.toLowerCase().includes(this.isbnFilter.toLowerCase()))
    );

    // Aplicar la ordenación
    filteredBooks = this.sortBooks(filteredBooks);

    this.totalBooks = filteredBooks.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  }

  /**
   * Trunca la descripción de un libro si es demasiado larga.
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
   * Obtiene las estrellas para la calificación de un libro.
   * @param rating - La calificación del libro.
   * @returns - Un array de estrellas (llenas, medias o vacías).
   */
  getStars(rating: number) {
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
}
