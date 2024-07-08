import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';
import { Subcategory } from '../../../interfaces/subcategory';
import { Category } from '../../../interfaces/category';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from '../loaders/loader/loader.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';

/**
 * Componente para mostrar y gestionar las categorías y subcategorías.
 * Este componente carga y filtra categorías y subcategorías, y permite la navegación a través de ellas.
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    LoaderComponent,
    TranslateModule,
    MatExpansionModule,
    MatTooltipModule,
    MainLoaderComponent
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  expandedCategoryId: number | null = null;
  subcategories: Subcategory[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.translationService.getCurrentLanguage());
    if (isPlatformBrowser(this.platformId)) {
      this.loadSubcategories();
      this.loadCategories();
    }
  }

  /**
   * Hook de inicialización del componente.
   * Carga las categorías y subcategorías.
   */
  ngOnInit() {
    this.isLoading = true;
    this.loadCategories();
    this.loadSubcategories();
    this.isLoading = false;
  }

  /**
   * Alterna la expansión de una categoría.
   * @param categoryId - ID de la categoría a expandir/contraer.
   * @param event - Evento de clic.
   */
  toggleCategory(categoryId: number, event: Event): void {
    event.stopPropagation();
    this.expandedCategoryId = this.expandedCategoryId === categoryId ? null : categoryId;
  }

  /**
   * Carga las subcategorías desde el servicio de traducción.
   */
  loadSubcategories(): void {
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedSubcategories = Object.values(this.translationService.subcategorias);
        this.subcategories = nestedSubcategories.flatMap((subcategory) =>
          Object.values(subcategory)
        );
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Carga las categorías desde el servicio de traducción.
   */
  loadCategories(): void {
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedCategories = Object.values(this.translationService.categorias);
        this.categories = nestedCategories.flatMap((category) =>
          Object.values(category)
        ).sort((a, b) => a.name.localeCompare(b.name));
        this.filteredCategories = this.categories;
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Filtra las categorías y subcategorías basándose en un valor de entrada.
   * @param event - Evento de entrada.
   */
  filterCategories(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!filterValue) {
      this.filteredCategories = this.categories;
      return;
    }
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(filterValue) ||
      this.getSubcategories(category.id).some(sub =>
        sub.name.toLowerCase().includes(filterValue)
      )
    );
  }

  /**
   * Obtiene las subcategorías de una categoría específica.
   * @param categoryId - ID de la categoría.
   * @returns Lista de subcategorías pertenecientes a la categoría.
   */
  getSubcategories(categoryId: number): Subcategory[] {
    return this.subcategories.filter(
      (subcategory) => subcategory.category_id === categoryId
    );
  }
}
