import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationService } from '../../services/translation.service';
import { Book } from '../../../interfaces/book';
import { Subcategory } from '../../../interfaces/subcategory';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RatingsComponent } from '../ratings/ratings.component';
import { RatingsService } from '../../services/ratings.service';
import { NotificationService } from '../../services/notification.service';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { User } from '../../../interfaces/user';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { CarouselModule } from 'primeng/carousel';

/**
 * Componente `BookComponent`
 * 
 * Este componente muestra los detalles de un libro, incluyendo su información, valoraciones y comentarios. También permite enviar valoraciones y muestra libros relacionados.
 */
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MainLoaderComponent,
    RouterLink,
    MatTabsModule,
    MatCardModule,
    ImageModalComponent,
    TranslateModule,
    RatingsComponent,
    CommentFormComponent,
    CommentListComponent,
    CarouselModule,
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  // Propiedades
  book: Book | undefined;
  user: User | undefined;
  bookId: number = 1;
  isLoading = false;
  subcategory: Subcategory | undefined;

  loggedIn = this.autenticacionService.isSesionIniciada();

  userRating: number | null = null;
  relatedAuthorBooks: Book[] = []; // Libros relacionados por autor
  relatedSubcategoryBooks: Book[] = []; // Libros relacionados por subcategoría

  showModal = false;

  responsiveOptions: any;

  // Constructor
  constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private ratingsService: RatingsService,
    private notificationService: NotificationService,
    library: FaIconLibrary,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private translate: TranslateService
  ) {
    library.addIcons(faStar, faStarHalfAlt);

    this.responsiveOptions = [
      {
        breakpoint: '1440px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  /**
   * Hook `ngOnInit`.
   * 
   * Inicializa el componente, carga la información del libro y las traducciones necesarias.
   */
  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe((params) => {
      this.bookId = +params['id'];
      this.loadUserRatingIfLoggedIn();
      this.loadRelatedBooks();
    });

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const bookInfo = this.translationService.getInfoBook(this.bookId);
        if (bookInfo && bookInfo.book) {
          this.book = bookInfo.book;
          this.subcategory = bookInfo.subcategory;
        } else {
          this.router.navigate(['/not-found']);
        }
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
    this.isLoading = false;
  }

  /**
   * Abre el modal de imagen del libro.
   */
  openModal() {
    this.showModal = true;
  }

  /**
   * Cierra el modal de imagen del libro.
   */
  closeModal() {
    this.showModal = false;
  }

  /**
   * Obtiene los datos del usuario desde el servicio de autenticación.
   */
  getUserData(): void {
    this.autenticacionService.getDatosUsuario().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.translate.get('NOTIFICATIONS.BOOK.USER_DATA_ERROR').subscribe((res: string) => {
          this.notificationService.showError(res, '');
        });
      },
    });
  }

  /**
   * Carga la valoración del usuario para el libro actual.
   */
  loadUserRating(): void {
    this.ratingsService.getRating(this.bookId).subscribe({
      next: (rating) => {
        this.userRating = parseFloat(rating.rating);
      },
      error: (error) => {
        this.translate.get('NOTIFICATIONS.BOOK.USER_RATING_ERROR').subscribe((res: string) => {
          this.notificationService.showError(res, '');
        });
      },
    });
  }

  /**
   * Carga la valoración del usuario solo si ha iniciado sesión.
   */
  loadUserRatingIfLoggedIn(): void {
    if (this.autenticacionService.isSesionIniciada()) {
      this.loadUserRating();
    }
  }

  /**
   * Envía la valoración del usuario para el libro actual.
   * @param rating - La valoración del usuario.
   */
  submitRating(rating: number): void {
    if (typeof rating === 'number') {
      this.ratingsService.submitRating(this.bookId, rating).subscribe({
        next: (response) => {
          this.translate.get('NOTIFICATIONS.BOOK.SUBMIT_RATING_SUCCESS').subscribe((res: string) => {
            this.notificationService.showSuccess(res, '');
            this.loadUserRating();
          });
        },
        error: (error) => {
          this.translate.get('NOTIFICATIONS.BOOK.SUBMIT_RATING_ERROR').subscribe((res: string) => {
            this.notificationService.showError(res, '');
          });
        },
      });
    } else {
      this.translate.get('NOTIFICATIONS.BOOK.INVALID_RATING').subscribe((res: string) => {
        this.notificationService.showError(res, '');
      });
    }
  }

  /**
   * Envía la valoración del usuario solo si ha iniciado sesión.
   * @param rating - La valoración del usuario.
   */
  submitRatingIfLoggedIn(rating: number): void {
    if (this.autenticacionService.isSesionIniciada()) {
      this.submitRating(rating);
    } else {
      this.translate.get('NOTIFICATIONS.BOOK.LOGIN_TO_RATE').subscribe((res: string) => {
        this.notificationService.showWarning(res, '');
      });
    }
  }

  /**
   * Abre el modal de la imagen del libro.
   */
  openImageModal() {
    this.dialog.open(ImageModalComponent, {
      data: {
        image: this.book?.image,
      },
    });
  }

  /**
   * Carga libros relacionados por autor y subcategoría.
   */
  loadRelatedBooks(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe(translations => {
      if (Object.keys(translations).length > 0) {
        const nestedBooks = Object.values(this.translationService.libros);
        this.relatedAuthorBooks = nestedBooks.flatMap(book => Object.values(book))
          .filter(book => book.author === this.book?.author && book.id !== this.bookId);
        this.relatedSubcategoryBooks = nestedBooks.flatMap(book => Object.values(book))
          .filter(book => book.subcategory_id === this.book?.subcategory_id && book.id !== this.bookId);
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);

    this.isLoading = false;
  }

  /**
   * Desplaza la página hacia arriba.
   */
  scrollToTop() {
    const topOfPageElement = document.getElementById('topOfPage');
    if (topOfPageElement) {
      topOfPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
