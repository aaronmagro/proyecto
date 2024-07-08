import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Book } from '../../../interfaces/book';
import { CommonModule } from '@angular/common';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookFormComponent } from '../book-form/book-form.component';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { NotificationService } from '../../services/notification.service';
import { BookService } from '../../services/book.service';

interface BookTableColumn {
  header: string;
  dataKey: keyof Book;
}

/**
 * Componente `BookListComponent`
 * 
 * Este componente muestra una lista de libros y permite realizar diversas operaciones como filtro, ordenación, edición, eliminación y exportación de libros a PDF.
 */
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MainLoaderComponent,
    TableModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,
    FormsModule,
    InputIconModule,
    ButtonModule,
    TranslateModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    FontAwesomeModule,
    BookFormComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  providers: [ConfirmationService],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedBooks: Book[] = [];
  selectedBook: Book | null = null; // Propiedad para el libro seleccionado para edición
  isLoading = true;
  sortField: keyof Book | '' = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchValue: string | undefined;
  showForm: boolean = false;

  languages = [
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Chinese', value: 'ch' },
    { label: 'Japanese', value: 'jp' },
    { label: 'Korean', value: 'ko' },
    { label: 'Spanish', value: 'es' },
    { label: 'English', value: 'en' },
  ];
  selectedLanguages: string[] = [];

  constructor(
    private translationService: TranslationService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    library: FaIconLibrary,
    private notificationService: NotificationService,
    private bookService: BookService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {
    library.addIcons(faStar, faStarHalfAlt);
  }

  /**
   * Hook `ngOnInit`.
   * 
   * Inicializa el componente y carga la lista de libros.
   */
  ngOnInit(): void {
    this.loadBooks();
    this.translate.onLangChange.subscribe(() => {
      this.loadBooks();
      this.translate
        .get('primeng')
        .subscribe((res) => this.primengConfig.setTranslation(res));
    });
  }

  /**
   * Carga la lista de libros desde el servicio de traducción.
   */
  loadBooks(): void {
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedBooks = Object.values(
          this.translationService.libros
        ).flatMap((bookGroup) => Object.values(bookGroup));
        this.books = nestedBooks.filter(
          (book) => typeof book === 'object'
        ) as Book[];
        this.filteredBooks = [...this.books];
        this.isLoading = false;
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Aplica un filtro global a la tabla de libros.
   * 
   * @param event - Evento de entrada de texto.
   */
  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();

    this.filteredBooks = this.books.filter((book) => {
      return (
        book.isbn.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value) ||
        book.price.toString().includes(value) ||
        book.publisher.toLowerCase().includes(value) ||
        book.language.toLowerCase().includes(value) ||
        book.title.toLowerCase().includes(value)
      );
    });
  }

  /**
   * Ordena la tabla de libros por el campo especificado.
   * 
   * @param field - Campo por el cual ordenar.
   */
  sortTable(field: keyof Book): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.filteredBooks = this.sortBooks(this.books, field, this.sortOrder);
  }

  /**
   * Ordena una lista de libros.
   * 
   * @param books - Lista de libros a ordenar.
   * @param field - Campo por el cual ordenar.
   * @param order - Orden ascendente o descendente.
   * @returns - Lista de libros ordenada.
   */
  sortBooks(books: Book[], field: keyof Book, order: 'asc' | 'desc'): Book[] {
    return books.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue == null || bValue == null) {
        return 0;
      }

      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  /**
   * Obtiene el icono de ordenación para un campo específico.
   * 
   * @param field - Campo para el cual obtener el icono.
   * @returns - Clase CSS del icono de ordenación.
   */
  getSortIcon(field: keyof Book): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }

  /**
   * Abre el modal de imagen para el libro especificado.
   * 
   * @param book - Libro para el cual abrir el modal de imagen.
   */
  openImageModal(book: Book): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        image: book.image,
      },
    });
  }

  /**
   * Limpia el filtro de la tabla.
   * 
   * @param table - Tabla a limpiar.
   */
  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
    this.filteredBooks = [...this.books];
  }

  /**
   * Edita el libro especificado.
   * 
   * @param book - Libro a editar.
   */
  editBook(book: Book): void {
    this.selectedBook = book;
    this.showForm = true;
  }

  /**
   * Abre el formulario para un nuevo libro.
   */
  openNew(): void {
    if (this.showForm) {
      this.showForm = false;
    } else {
      this.selectedBook = null;
      this.showForm = true;
    }
  }

  /**
   * Confirma la eliminación del libro especificado.
   * 
   * @param book - Libro a eliminar.
   */
  confirmDelete(book: Book) {
    if (book.id !== undefined) {
      this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_BOOK', { title: book.title }).subscribe((message: string) => {
        this.confirmationService.confirm({
          message: message,
          header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
          icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
          accept: () => {
            this.deleteBook(book.id!);
          },
          reject: () => {
            this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.BOOK_LIST.DELETE_CANCELLED'), '');
          },
        });
      });
    } else {
      this.notificationService.showError(this.translate.instant('NOTIFICATIONS.BOOK_LIST.DELETE_ERROR'), '');
    }
  }

  /**
   * Confirma la eliminación de los libros seleccionados.
   */
  confirmDeleteSelectedBooks() {
    const selectedBookTitles = this.selectedBooks
      .map((book) => book.title)
      .join(', ');

    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_SELECTED_BOOKS', { titles: selectedBookTitles }).subscribe((message: string) => {
      this.confirmationService.confirm({
        message: message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          const bookIds = this.selectedBooks
            .map((book) => book.id)
            .filter((id) => id !== undefined) as number[];
          bookIds.forEach((id) => {
            this.deleteBook(id);
          });
          this.selectedBooks = [];
        },
        reject: () => {
          this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.BOOK_LIST.DELETE_CANCELLED'), '');
        },
      });
    });
  }

  /**
   * Elimina el libro con el ID especificado.
   * 
   * @param id - ID del libro a eliminar.
   */
  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(
      (response) => {
        this.loadBooks();
        this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.BOOK_LIST.DELETE_SUCCESS'), '');
      },
      (error) => {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.BOOK_LIST.DELETE_ERROR'), '');
      }
    );
  }

  /**
   * Elimina los libros seleccionados.
   */
  deleteSelectedBooks() {
    const bookIds = this.selectedBooks
      .map((book) => book.id)
      .filter((id) => id !== undefined) as number[];
    bookIds.forEach((id) => {
      this.deleteBook(id);
    });
    this.selectedBooks = [];
  }

  /**
   * Exporta la lista de libros a un archivo PDF.
   */
  async exportBooks() {
    try {
      const doc = new jsPDF({ orientation: 'landscape', format: 'a2' });

      doc.setFontSize(22); // Tamaño de fuente para el título
      doc.setFont('helvetica', 'bold'); // Estilo de fuente para el título
      doc.text(this.translate.instant('Books List'), doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center',
      });

      // Define las columnas y las filas
      const columns: BookTableColumn[] = [
        { header: 'ID', dataKey: 'id' },
        { header: 'isbn', dataKey: 'isbn' },
        { header: 'title', dataKey: 'title' },
        { header: 'publisher', dataKey: 'publisher' },
        { header: 'language', dataKey: 'language' },
        { header: 'author', dataKey: 'author' },
        { header: 'desc', dataKey: 'desc' },
        { header: 'price', dataKey: 'price' },
        { header: 'image', dataKey: 'image' },
        { header: 'image', dataKey: 'image' },
        { header: 'subcategory_id', dataKey: 'subcategory_id' },
        { header: 'average_rating', dataKey: 'average_rating' },
        { header: 'rating_count', dataKey: 'rating_count' },
        { header: 'comments_count', dataKey: 'comments_count' },
        { header: 'created_at', dataKey: 'created_at' },
        { header: 'updated_at', dataKey: 'updated_at' },
      ];

      const rows = await Promise.all(
        this.books.map(async (book) => ({
          id: book.id,
          isbn: book.isbn,
          title: book.title,
          publisher: book.publisher,
          language: book.language,
          author: book.author,
          desc: book.desc,
          title_es: book.title_es,
          desc_es: book.desc_es,
          title_en: book.title_en,
          desc_en: book.desc_en,
          price: book.price,
          image: await this.getBase64ImageFromURL(book.image),
          img_url: book.image,
          subcategory_id: book.subcategory_id,
          average_rating: book.average_rating,
          rating_count: book.rating_count,
          comments_count: book.comments_count,
          created_at: book.created_at,
          updated_at: book.updated_at,
        }))
      );

      // Genera la tabla sin imágenes
      (doc as any).autoTable({
        head: [columns.map((col) => col.header)],
        body: rows.map((row) =>
          columns.map((col) => {
            if (col.dataKey === 'image') {
              return ''; // Deja el contenido de la celda de la imagen vacío
            }
            return row[col.dataKey];
          })
        ),
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          minCellHeight: 15,
          fillColor: [243, 234, 243], // Color #f3eaf3 for the normal rowss
        },
        headStyles: {
          fillColor: [132, 112, 131], // Color #847083 for the header
          textColor: [255, 255, 255], // White text color
          halign: 'center',
          valign: 'middle',
        },
        bodyStyles: {
          fillColor: [243, 234, 243], // Color #f3eaf3 for the normal rows
          textColor: [0, 0, 0], // Black text color
        },
        alternateRowStyles: {
          fillColor: [228, 212, 228], // Color #e4d4e4 for alternate rows
        },

        columnStyles: {
          0: { cellWidth: 15 }, // ID
          1: { cellWidth: 28 }, // ISBN
          2: { cellWidth: 37 }, // Title
          3: { cellWidth: 37 }, // Publisher
          4: { cellWidth: 20 }, // Language
          5: { cellWidth: 30 }, // Author
          //6: { cellWidth: 120 }, // Description
          7: { cellWidth: 15 }, // Price
          8: { cellWidth: 18 }, // Image
          9: { cellWidth: 47 }, // Image URL
          10: { cellWidth: 28 }, // Subcategory ID
          11: { cellWidth: 28 }, // Average Rating
          12: { cellWidth: 26 }, // Rating Count
          13: { cellWidth: 32 }, // Comments Count
          14: { cellWidth: 21 }, // Created At
          15: { cellWidth: 21 }, // Updated At
        },
        margin: { top: 20 },
        didDrawCell: (data: any) => {
          // Verifica si la celda es la de la imagen y la añade al PDF
          if (data.section === 'body') {
            const rowIndex = data.row.index;

            if (data.column.index === 8) {
              const imageContent = rows[rowIndex] ? rows[rowIndex].image : null;

              // Poner la imagen en las dimensiones de la foto de un libro
              if (imageContent) {
                const imgProps = doc.getImageProperties(imageContent);
                const imgRatio = imgProps.width / imgProps.height;
                let cellHeight = data.cell.height - 4;
                let cellWidth = cellHeight * imgRatio;

                if (cellWidth > data.cell.width - 4) {
                  cellWidth = data.cell.width - 4;
                  cellHeight = cellWidth / imgRatio;
                }

                doc.addImage(
                  imageContent,
                  'JPEG',
                  data.cell.x + (data.cell.width - cellWidth) / 2,
                  data.cell.y + (data.cell.height - cellHeight) / 2,
                  cellWidth,
                  cellHeight
                );
              }
            } else if (data.column.index === 9) {
              const imgUrl = rows[rowIndex] ? rows[rowIndex].img_url : '';
              const textLines = doc.splitTextToSize(imgUrl, data.cell.width - 4);
              doc.text(textLines, data.cell.x + 2, data.cell.y + 5);
            }
          }
        },
      });

      // Abre el PDF en una nueva ventana para impresión
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      printWindow?.addEventListener('load', function () {
        printWindow.print();
      });

      this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.BOOK_LIST.EXPORT_SUCCESS'), '');
    } catch (error) {
      this.notificationService.showError(this.translate.instant('NOTIFICATIONS.BOOK_LIST.EXPORT_ERROR'), '');
    }
  }

  /**
   * Obtiene la imagen en base64 desde una URL.
   * 
   * @param url - URL de la imagen.
   * @returns - Promesa con la imagen en base64.
   */
  async getBase64ImageFromURL(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Obtiene las estrellas para la calificación del libro.
   * 
   * @param rating - Calificación del libro.
   * @returns - Array de estrellas.
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

  /**
   * Método para cerrar el formulario de edición desde el componente hijo.
   */
  onFormClose(): void {
    this.showForm = false;
    this.loadBooks();
  }
}
