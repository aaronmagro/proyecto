import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { Book } from '../../../interfaces/book';
import { CommonModule } from '@angular/common';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subcategory } from '../../../interfaces/subcategory';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { BookService } from '../../services/book.service';

const LANGUAGES = [
  { code: 'es', label: 'SPANISH' },
  { code: 'en', label: 'ENGLISH' },
  { code: 'fr', label: 'FRENCH' },
  { code: 'de', label: 'GERMAN' },
  { code: 'it', label: 'ITALIAN' },
  { code: 'pt', label: 'PORTUGUESE' },
  { code: 'ch', label: 'CHINESE' },
  { code: 'jp', label: 'JAPANESE' },
  { code: 'ko', label: 'KOREAN' },
];

/**
 * Componente `BookFormComponent`
 * 
 * Este componente se utiliza para crear y editar libros, incluyendo la selección de subcategorías y la carga de imágenes. Permite al usuario introducir información en varios idiomas.
 */
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MainLoaderComponent,
    AngularEditorModule,
    TranslateModule,
    DropdownModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null; // Recibe el libro desde el componente padre
  @Output() formClose = new EventEmitter<void>();
  bookForm: FormGroup;
  imageFile: File | undefined;
  imageFileName: string | undefined;
  imagePreview: string | ArrayBuffer | null = null;
  useFile: boolean = true;
  isLoading = false;
  selectedTab: string = 'book';
  languages = LANGUAGES;

  subcategorias: Subcategory[] = [];
  filteredSubcategorias: Subcategory[] = [];
  searchTerm: string = '';
  selectedSubcategoria: Subcategory | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notification: NotificationService,
    private translationService: TranslationService,
    private bookService: BookService,
    private translate: TranslateService
  ) {
    this.bookForm = this.fb.group({
      isbn: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', Validators.required],
      publisher: ['', Validators.required],
      language: ['', Validators.required],
      image: [''],
      imageUrl: [''],
      subcategory_id: ['', Validators.required],
      title_es: ['', Validators.required],
      desc_es: ['', Validators.required],
      title_en: ['', Validators.required],
      desc_en: ['', Validators.required],
    });
  }

  /**
   * Hook `ngOnInit`.
   * 
   * Inicializa el componente y carga las subcategorías disponibles.
   */
  ngOnInit(): void {
    this.loadSubcategorias();
  }

  /**
   * Carga los datos del libro en el formulario si se proporciona uno.
   */
  loadBookData(): void {
    this.isLoading = true;
    if (this.book) {
      this.bookForm.patchValue({
        isbn: this.book.isbn,
        author: this.book.author,
        price: this.book.price,
        publisher: this.book.publisher,
        language: this.book.language,
        image: '',
        imageUrl: this.book.image,
        subcategory_id: this.book.subcategory_id,
      });

      this.imagePreview = this.book.image || null;

      this.selectedSubcategoria =
        this.subcategorias.find(
          (subcategoria) => subcategoria.id === this.book?.subcategory_id
        ) || null;

      if (this.selectedSubcategoria) {
        this.bookForm.patchValue({
          subcategory_id: this.selectedSubcategoria.id,
        });
      }
      this.isLoading = false;
    }
  }

  /**
   * Carga las traducciones del libro.
   */
  loadBookTranslations(): void {
    this.isLoading = true;
    if (this.book) {
      this.bookService.showBookTranslations(this.book.id!).subscribe(
        (response) => {
          console.log(response);
          this.bookForm.patchValue({
            title_es: response.title_es,
            desc_es: response.desc_es,
            title_en: response.title_en,
            desc_en: response.desc_en,
          });
          this.isLoading = false;
        },
        (error) => {
          this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVE_FAILED').subscribe((res: string) => {
            this.notification.showError(res, '');
          });
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Maneja la selección de un archivo de imagen.
   * 
   * @param event - Evento de cambio del input de archivo.
   */
  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
    this.imageFileName = this.imageFile ? this.imageFile.name : undefined;
    // Cargar vista previa de la imagen
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.imagePreview = null;
    }
  }

  /**
   * Guarda el libro utilizando los datos del formulario.
   */
  saveBook(): void {
    const {
      isbn,
      author,
      price,
      publisher,
      language,
      title_es,
      desc_es,
      title_en,
      desc_en,
      imageUrl,
    } = this.bookForm.value;

    const book: Book = {
      isbn,
      author,
      price,
      publisher,
      language,
      subcategory_id: this.selectedSubcategoria
        ? Number(this.selectedSubcategoria.id)
        : 0,
      title: `book_title ${this.slugify(title_es)}`,
      desc: `book_desc ${this.slugify(title_es)}`,
      average_rating: 0,
      rating_count: 0,
      comments_count: 0,
      image: '',
    };

    this.isLoading = true;

    // Mostrar mensajes según los campos que faltan o validaciones de los mismos
    if (!book.isbn) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.ISBN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.author) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.AUTHOR_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.price) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.PRICE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.publisher) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.PUBLISHER_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.language) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.LANGUAGE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.subcategory_id) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.SUBCATEGORY_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!title_es) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.TITLE_ES_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!desc_es) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.DESC_ES_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!title_en) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.TITLE_EN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!desc_en) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.DESC_EN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!this.imageFile && !imageUrl) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.IMAGE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (this.bookForm.invalid) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.FILL_REQUIRED_FIELDS').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
      this.isLoading = false;
      return;
    }

    if (this.useFile && this.imageFile) {
      this.bookService
        .saveBook(
          book,
          this.imageFile,
          imageUrl,
          title_es,
          desc_es,
          title_en,
          desc_en
        )
        .subscribe(
          (response) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVED_SUCCESS').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
              this.formClose.emit();
              this.isLoading = false;
            });
          },
          (error) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVE_FAILED').subscribe((res: string) => {
              this.notification.showError(res, '');
              this.isLoading = false;
            });
          }
        );
    } else if (!this.useFile && imageUrl) {
      this.bookService
        .saveBook(
          book,
          undefined,
          imageUrl,
          title_es,
          desc_es,
          title_en,
          desc_en
        )
        .subscribe(
          (response) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVED_SUCCESS').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
              this.formClose.emit();
              this.isLoading = false;
            });
          },
          (error) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVE_FAILED').subscribe((res: string) => {
              this.notification.showError(res, '');
              this.isLoading = false;
            });
          }
        );
    } else {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.IMAGE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
        this.isLoading = false;
      });
    }
  }

  /**
   * Actualiza los datos del libro.
   */
  updateBook(): void {
    if (!this.book) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_SAVE_FAILED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
      return;
    }

    const {
      isbn,
      author,
      price,
      publisher,
      language,
      title_es,
      desc_es,
      title_en,
      desc_en,
      imageUrl,
    } = this.bookForm.value;

    const book: Book = {
      id: this.book.id,
      isbn,
      author,
      price,
      publisher,
      language,
      subcategory_id: this.selectedSubcategoria
        ? Number(this.selectedSubcategoria.id)
        : 0,
      title: `book_title ${this.slugify(title_es)}`,
      desc: `book_desc ${this.slugify(title_es)}`,
      average_rating: 0,
      rating_count: 0,
      comments_count: 0,
      image: '',
    };

    this.isLoading = true;

    // Mostrar mensajes según los campos que faltan o validaciones de los mismos
    if (!book.isbn) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.ISBN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.author) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.AUTHOR_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.price) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.PRICE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.publisher) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.PUBLISHER_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.language) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.LANGUAGE_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!book.subcategory_id) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.SUBCATEGORY_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!title_es) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.TITLE_ES_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!desc_es) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.DESC_ES_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!title_en) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.TITLE_EN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (!desc_en) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.DESC_EN_REQUIRED').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
    }

    if (this.bookForm.invalid) {
      this.translate.get('NOTIFICATIONS.BOOK_FORM.FILL_REQUIRED_FIELDS').subscribe((res: string) => {
        this.notification.showError(res, '');
      });
      this.isLoading = false;
      return;
    }

    if (this.useFile && this.imageFile) {
      this.bookService
        .updateBook(
          book,
          this.imageFile,
          imageUrl,
          title_es,
          desc_es,
          title_en,
          desc_en
        )
        .subscribe(
          (response) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATED_SUCCESS').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
              this.formClose.emit();
              this.isLoading = false;
            });
          },
          (error) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATE_FAILED').subscribe((res: string) => {
              this.notification.showError(res, '');
              this.isLoading = false;
            });
          }
        );
    } else if (!this.useFile && imageUrl) {
      this.bookService
        .updateBook(
          book,
          undefined,
          imageUrl,
          title_es,
          desc_es,
          title_en,
          desc_en
        )
        .subscribe(
          (response) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATED_SUCCESS').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
              this.formClose.emit();
              this.isLoading = false;
            });
          },
          (error) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATE_FAILED').subscribe((res: string) => {
              this.notification.showError(res, '');
              this.isLoading = false;
            });
          }
        );
    } else {
      this.bookService
        .updateBook(
          book,
          this.imageFile,
          imageUrl,
          title_es,
          desc_es,
          title_en,
          desc_en
        )
        .subscribe(
          (response) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATED_SUCCESS').subscribe((res: string) => {
              this.notification.showSuccess(res, '');
              this.formClose.emit();
              this.isLoading = false;
            });
          },
          (error) => {
            this.translate.get('NOTIFICATIONS.BOOK_FORM.BOOK_UPDATE_FAILED').subscribe((res: string) => {
              this.notification.showError(res, '');
              this.isLoading = false;
            });
          }
        );
    }
  }

  /**
   * Carga las subcategorías disponibles.
   */
  loadSubcategorias(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedSubcategories = Object.values(
          this.translationService.subcategorias
        );
        this.subcategorias = nestedSubcategories.flatMap((subcategory) =>
          Object.values(subcategory)
        );
        this.filteredSubcategorias = this.subcategorias;
        this.isLoading = false;
      }
    });

    // Cargar datos del libro si se ha proporcionado uno después de cargar las subcategorías para no perder la selección
    if (this.book) {
      this.loadBookData();
      this.loadBookTranslations();
    }

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Filtra las subcategorías basándose en el término de búsqueda.
   */
  filterSubcategorias(): void {
    if (!this.searchTerm) {
      this.filteredSubcategorias = this.subcategorias;
      return;
    }
    this.filteredSubcategorias = this.subcategorias.filter((subcategoria) =>
      subcategoria.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Convierte el texto en un slug.
   * 
   * @param text - Texto a convertir.
   * @returns - Texto convertido en slug.
   */
  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }

  /**
   * Abre el modal de imagen.
   */
  openImageModal(): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        image: this.imagePreview,
      },
    });
  }

  /**
   * Actualiza la vista previa de la imagen basada en la URL.
   */
  updateImagePreview(): void {
    const imageUrl = this.bookForm.get('imageUrl')?.value;
    if (!this.useFile) {
      this.imagePreview = imageUrl;
    }
  }
}
