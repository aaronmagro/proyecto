import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { Subcategory } from '../../../interfaces/subcategory';
import { Book } from '../../../interfaces/book';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { Subscription } from 'rxjs';

/**
 * Componente para mostrar los detalles de una subcategoría y sus libros asociados.
 */
@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MainLoaderComponent, RouterModule],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent {
  subcategory: Subcategory | undefined;
  books: Book[] = [];
  isLoading = false;
  private langChangeSub: Subscription;

  /**
   * Constructor del componente que inyecta los servicios necesarios.
   * @param route - Servicio para manejar la ruta activada.
   * @param translationService - Servicio de traducción para manejar idiomas.
   */
  constructor(
    private route: ActivatedRoute,
    private translationService: TranslationService,
  ) {
    this.langChangeSub = this.translationService.translations$.subscribe(() => {
      this.loadCurrentSubcategory(); // Recarga la subcategoría cada vez que el idioma cambia
    });
  }

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const subcategoryId = +params['id']; // Convertimos el ID de la URL a número
      this.loadSubcategoryBooks(subcategoryId);
    });

    this.translationService.loadLanguage(); // Carga inicial del idioma
  }

  /**
   * Carga los libros de una subcategoría específica.
   * @param subcategoryId - ID de la subcategoría.
   */
  loadSubcategoryBooks(subcategoryId: number): void {
    // Refrescar cuando los datos de traducción cambian
    this.loadCurrentSubcategory(subcategoryId);
  }

  /**
   * Carga la subcategoría actual y sus libros asociados.
   * @param subcategoryId - (Opcional) ID de la subcategoría.
   */
  loadCurrentSubcategory(subcategoryId?: number): void {
    if (!subcategoryId && this.subcategory) {
      subcategoryId = this.subcategory.id; // Reutiliza el ID actual si no se proporciona uno nuevo
    }
    if (subcategoryId) {
      const subcategoryInfo = this.translationService.getSubcategoryById(subcategoryId);
      if (subcategoryInfo) {
        this.subcategory = subcategoryInfo.subcategory;
        this.books = subcategoryInfo.books;
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  }

  /**
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe(); // Asegura limpiar la suscripción
  }
}
