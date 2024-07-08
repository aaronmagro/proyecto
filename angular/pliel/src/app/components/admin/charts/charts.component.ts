import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Chart, ChartEvent } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { Book } from '../../../interfaces/book';
import { MainLoaderComponent } from '../../../shared/components/loaders/main-loader/main-loader.component';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../shared/services/translation.service';
import { StatisticService } from '../../../shared/services/statistic.service';
import { LogListComponent } from '../log-list/log-list.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

/**
 * Componente `ChartsComponent`
 * 
 * Este componente es responsable de mostrar varias estadísticas y gráficos relacionados con libros y usuarios.
 * 
 * @selector `app-charts`
 * @imports `CommonModule`, `MainLoaderComponent`, `FormsModule`, `LogListComponent`, `TranslateModule`
 * @templateUrl `./charts.component.html`
 * @styleUrls `['./charts.component.scss']`
 */
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    MainLoaderComponent,
    FormsModule,
    LogListComponent,
    TranslateModule,
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('combinedChart') combinedChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('booksByPublisherChart') booksByPublisherChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('booksByAuthorChart') booksByAuthorChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('activeUsersChart') activeUsersChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersByRegionChart') usersByRegionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('newUsersChart') newUsersChart!: ElementRef<HTMLCanvasElement>;

  books: Book[] = [];
  isLoading = false;
  showAdditionalCharts = false;
  numRecordsCombined: number = 5;
  numRecordsPublisher: number = 5;
  numRecordsAuthor: number = 5;
  numRecordsUserStats: number = 5;
  recordOptions: number[] = [5, 10, 15, 25, 50, 100];

  private combinedChartInstance!: Chart;
  private booksByPublisherChartInstance!: Chart;
  private booksByAuthorChartInstance!: Chart;
  private userStatisticsChartInstance!: Chart;

  constructor(
    private translationService: TranslationService,
    private statisticService: StatisticService,
    private translate: TranslateService
  ) {}

  /**
   * Método `ngOnInit`
   * 
   * Carga los libros y las traducciones necesarias cuando el componente se inicializa.
   */
  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Método `ngAfterViewInit`
   * 
   * Crea los gráficos después de que la vista del componente haya sido inicializada. También implementa
   * la funcionalidad de navegación por pestañas.
   */
  ngAfterViewInit() {
    if (!this.isLoading) {
      this.createCharts();
    }
    this.setupTabNavigation();
  }

  /**
   * Método `loadBooks`
   * 
   * Carga los datos de los libros y las traducciones necesarias para los gráficos.
   */
  loadBooks(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedBooks = Object.values(this.translationService.libros);
        this.books = nestedBooks.flatMap((book) => Object.values(book));
        this.isLoading = false;
        this.createCharts();
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Método `createCharts`
   * 
   * Crea todos los gráficos utilizando los datos y traducciones actuales.
   */
  createCharts() {
    this.translate.get([
      'COMMENTS',
      'AVERAGE_RATING',
      'RATING_COUNT',
      'BOOKS_BY_PUBLISHER',
      'BOOKS_BY_AUTHOR',
      'MAIN_COMMENTS',
      'REPLIES'
    ]).subscribe(translations => {
      this.createCombinedChart(translations);
      this.createBooksByPublisherChart(translations);
      this.createBooksByAuthorChart(translations);
      this.loadUserStatistics(translations);
    });
  }

  /**
   * Método `setCanvasResolution`
   * 
   * Ajusta la resolución del canvas para asegurar que los gráficos se vean nítidos en pantallas de alta densidad.
   * 
   * @param canvas El elemento de canvas cuyo tamaño se va a ajustar.
   */
  setCanvasResolution(canvas: HTMLCanvasElement) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
  }

  /**
   * Método `updateCharts`
   * 
   * Actualiza los gráficos con la cantidad de registros seleccionada por el usuario.
   * Se ejecuta cuando el usuario cambia la cantidad de registros a mostrar.
   */
  updateCharts() {
    this.createCharts();
  }

  /**
   * Método `createCombinedChart`
   * 
   * Crea un gráfico combinado que muestra los libros más comentados, mejor valorados y más valorados.
   * 
   * @param translations Traducciones necesarias para los rótulos del gráfico.
   */
  createCombinedChart(translations: any) {
    if (!this.combinedChart) return;
    const canvas = this.combinedChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.setCanvasResolution(canvas);

      const mostCommentedBooks = this.books.slice(0, this.numRecordsCombined);
      const bestRatedBooks = this.books.slice(0, this.numRecordsCombined);
      const mostRatedBooks = this.books.slice(0, this.numRecordsCombined);

      if (this.combinedChartInstance) {
        this.combinedChartInstance.destroy();
      }

      this.combinedChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from(
            new Set([
              ...mostCommentedBooks.map((book) => book.title),
              ...bestRatedBooks.map((book) => book.title),
              ...mostRatedBooks.map((book) => book.title),
            ])
          ),
          datasets: [
            {
              label: translations['COMMENTS'],
              data: mostCommentedBooks.map((book) => book.comments_count),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.2,
            },
            {
              label: translations['AVERAGE_RATING'],
              data: bestRatedBooks.map((book) => book.average_rating),
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.2,
            },
            {
              label: translations['RATING_COUNT'],
              data: mostRatedBooks.map((book) => book.rating_count),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.2,
            },
          ],
        },
        options: {
          interaction: {
            mode: 'index',
            intersect: false,
          },
          animation: {
            duration: 1000,
            easing: 'easeOutBounce',
          },
        },
      });
    } else {
      console.error('Could not get context for the combined chart.');
    }
  }

  /**
   * Método `createBooksByPublisherChart`
   * 
   * Crea un gráfico de barras que muestra la cantidad de libros por editorial.
   * 
   * @param translations Traducciones necesarias para los rótulos del gráfico.
   */
  createBooksByPublisherChart(translations: any) {
    if (!this.booksByPublisherChart) return;
    const canvas = this.booksByPublisherChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.setCanvasResolution(canvas);

      const booksByPublisher = this.books.reduce((acc, book) => {
        if (!acc[book.publisher]) {
          acc[book.publisher] = 0;
        }
        acc[book.publisher]++;
        return acc;
      }, {} as Record<string, number>);

      const publisherLabels = Object.keys(booksByPublisher).slice(
        0,
        this.numRecordsPublisher
      );
      const publisherData = publisherLabels.map(
        (label) => booksByPublisher[label]
      );

      if (this.booksByPublisherChartInstance) {
        this.booksByPublisherChartInstance.destroy();
      }

      this.booksByPublisherChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: publisherLabels,
          datasets: [
            {
              label: translations['BOOKS_BY_PUBLISHER'],
              data: publisherData,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          interaction: {
            mode: 'index',
            intersect: false,
          },
          animation: {
            duration: 1500,
            easing: 'easeInQuad',
          },
        },
      });
    } else {
      console.error('Could not get context for the books by publisher chart.');
    }
  }

  /**
   * Método `createBooksByAuthorChart`
   * 
   * Crea un gráfico de barras que muestra la cantidad de libros por autor.
   * 
   * @param translations Traducciones necesarias para los rótulos del gráfico.
   */
  createBooksByAuthorChart(translations: any) {
    if (!this.booksByAuthorChart) return;
    const canvas = this.booksByAuthorChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.setCanvasResolution(canvas);

      const booksByAuthor = this.books.reduce((acc, book) => {
        if (!acc[book.author]) {
          acc[book.author] = 0;
        }
        acc[book.author]++;
        return acc;
      }, {} as Record<string, number>);

      const authorLabels = Object.keys(booksByAuthor).slice(
        0,
        this.numRecordsAuthor
      );
      const authorData = authorLabels.map((label) => booksByAuthor[label]);

      if (this.booksByAuthorChartInstance) {
        this.booksByAuthorChartInstance.destroy();
      }

      this.booksByAuthorChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: authorLabels,
          datasets: [
            {
              label: translations['BOOKS_BY_AUTHOR'],
              data: authorData,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          interaction: {
            mode: 'index',
            intersect: false,
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
          },
        },
      });
    } else {
      console.error('Could not get context for the books by author chart.');
    }
  }

  /**
   * Método `loadUserStatistics`
   * 
   * Carga las estadísticas de usuarios y crea el gráfico correspondiente.
   * 
   * @param translations Traducciones necesarias para los rótulos del gráfico.
   */
  loadUserStatistics(translations: any) {
    this.statisticService.getUserStatistics().subscribe(
      (data) => {
        const filteredData = data.slice(0, this.numRecordsUserStats);

        const labels = filteredData.map(
          (item: { username: string }) => item.username
        );
        const commentsCount = filteredData.map(
          (item: { main_comments_count: number }) => item.main_comments_count
        );
        const repliesCount = filteredData.map(
          (item: { replies_count: number }) => item.replies_count
        );
        const averageRating = filteredData.map(
          (item: { average_rating: number }) => item.average_rating
        );
        const ratingCount = filteredData.map(
          (item: { rating_count: number }) => item.rating_count
        );

        const canvas = document.getElementById(
          'userStatisticsChart'
        ) as HTMLCanvasElement;
        this.setCanvasResolution(canvas);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (this.userStatisticsChartInstance) {
            this.userStatisticsChartInstance.destroy();
          }
          this.userStatisticsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: translations['MAIN_COMMENTS'],
                  data: commentsCount,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  fill: false,
                  tension: 0.2,
                },
                {
                  label: translations['REPLIES'],
                  data: repliesCount,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  fill: false,
                  tension: 0.2,
                },
                {
                  label: translations['AVERAGE_RATING'],
                  data: averageRating,
                  backgroundColor: 'rgba(255, 206, 86, 0.2)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  fill: false,
                  tension: 0.2,
                },
                {
                  label: translations['RATING_COUNT'],
                  data: ratingCount,
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 1,
                  fill: false,
                  tension: 0.2,
                },
              ],
            },
            options: {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              animation: {
                duration: 1200,
                easing: 'easeOutBounce',
              },
            },
          });
        } else {
          console.error('Could not get context for the user statistics chart.');
        }
      },
      (error) => {
        console.error('Error loading user statistics:', error);
      }
    );
  }

  /**
   * Método `setupTabNavigation`
   * 
   * Configura la navegación por pestañas en el componente. (Mismo que en `AdminManagementComponent`)
   */
  private setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-nav a');
    const tabContents = document.querySelectorAll<HTMLElement>('.con-box');

    tabLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        tabLinks.forEach((nav) => nav.parentElement?.classList.remove('on'));
        tabContents.forEach((content) => (content.style.display = 'none'));

        if (targetId) {
          const targetElement = document.querySelector<HTMLElement>(targetId);
          if (targetElement) {
            targetElement.style.display = 'block';
            (e.target as HTMLElement).parentElement?.classList.add('on');
          }
        }
      });
    });
  }
}
