import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { Subcategory } from '../../../interfaces/subcategory';
import { Category } from '../../../interfaces/category';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { TranslationService } from '../../services/translation.service';
import { DropdownModule } from 'primeng/dropdown';

/**
 * Componente para manejar el formulario de subcategorías, permite crear y actualizar subcategorías.
 */
@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [
    CommonModule,
    MainLoaderComponent,
    TranslateModule,
    ReactiveFormsModule,
    AngularEditorModule,
    DropdownModule,
  ],
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['./subcategory-form.component.scss'],
})
export class SubcategoryFormComponent implements OnInit {
  @Input() subcategory: Subcategory | null = null; // Recibe la subcategoría desde el componente padre
  @Output() formClose = new EventEmitter<void>();
  subcategoryForm: FormGroup;
  isLoading = false;
  selectedTab: string = 'subcategory';

  categories: Category[] = [];
  selectedCategory: Category | null = null;
  filteredCategories: Category[] = [];
  searchTerm: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '5rem',
    minHeight: '3rem',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  /**
   * Constructor del componente que inyecta los servicios necesarios.
   * @param fb - Servicio de FormBuilder para crear formularios reactivos.
   * @param dialog - Servicio de MatDialog para manejo de diálogos.
   * @param notification - Servicio de notificaciones.
   * @param translationService - Servicio de traducción para manejar idiomas.
   * @param subcategoryService - Servicio para manejar subcategorías.
   * @param translate - Servicio para traducir texto.
   */
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notification: NotificationService,
    private translationService: TranslationService,
    private subcategoryService: SubcategoryService,
    private translate: TranslateService
  ) {
    this.subcategoryForm = this.fb.group({
      name_es: ['', Validators.required],
      name_en: ['', Validators.required],
      desc_es: ['', Validators.required],
      desc_en: ['', Validators.required],
      category_id: [null, Validators.required],
    });
  }

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Carga los datos de la subcategoría en el formulario.
   */
  loadSubcategoryData(): void {
    this.isLoading = true;
    if (this.subcategory) {
      this.subcategoryForm.patchValue({
        category_id: this.subcategory.category_id,
      });
      this.selectedCategory =
        this.categories.find(
          (category) => category.id === this.subcategory?.category_id
        ) || null;
      if (this.selectedCategory) {
        this.subcategoryForm.patchValue({
          category_id: this.selectedCategory.id,
        });
      }
      this.isLoading = false;
    }
  }

  /**
   * Carga las traducciones de la subcategoría en el formulario.
   */
  loadSubcategoryTranslations(): void {
    this.isLoading = true;
    if (this.subcategory) {
      this.subcategoryService
        .showSubcategoryTranslations(this.subcategory.id)
        .subscribe(
          (response) => {
            this.subcategoryForm.patchValue({
              name_es: response.name_es,
              name_en: response.name_en,
              desc_es: response.desc_es,
              desc_en: response.desc_en,
            });
            this.isLoading = false;
          },
          (error) => {
            this.notification.showError(
              this.translate.instant('NOTIFICATIONS.SUBCATEGORY_FORM.LOAD_TRANSLATIONS_ERROR'),
              ''
            );
            this.isLoading = false;
          }
        );
    }
  }

  /**
   * Carga las categorías disponibles para seleccionar en el formulario.
   */
  loadCategories(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedCategories = Object.values(
          this.translationService.categorias
        );
        this.categories = nestedCategories.flatMap((category) =>
          Object.values(category)
        );
        this.filteredCategories = this.categories;
        this.isLoading = false;
      }
    });

    // Cargar datos de la subcategoría después de cargar las categorías
    if (this.subcategory) {
      this.loadSubcategoryData();
      this.loadSubcategoryTranslations();
    }

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Guarda una nueva subcategoría.
   */
  saveSubcategory(): void {
    const { name_es, name_en, desc_es, desc_en, category_id } =
      this.subcategoryForm.value;

    const subcategory: Subcategory = {
      category_id: this.selectedCategory ? Number(this.selectedCategory.id) : 0,
      name: `subcat_name ${this.slugify(name_es)}`,
      desc: `subcat_desc ${this.slugify(name_es)}`,
      id: 0,
    };

    this.subcategoryService
      .saveSubcategory(name_es, name_en, desc_es, desc_en, category_id.id)
      .subscribe(
        (response) => {
          this.notification.showSuccess(
            this.translate.instant('NOTIFICATIONS.SUBCATEGORY_FORM.SUCCESS_SAVE_MESSAGE'),
            ''
          );
          this.formClose.emit();
          this.isLoading = false;
        },
        (error) => {
          this.notification.showError(
            this.translate.instant('NOTIFICATIONS.SUBCATEGORY_FORM.ERROR_SAVE_MESSAGE'),
            ''
          );
          this.isLoading = false;
        }
      );
  }

  /**
   * Actualiza una subcategoría existente.
   */
  updateSubcategory(): void {
    const { name_es, name_en, desc_es, desc_en, category_id } =
      this.subcategoryForm.value;

    const subcategory: Subcategory = {
      ...this.subcategory,
      ...this.subcategoryForm.value,
      name: `subcat_name ${this.slugify(name_es)}`,
      desc: `subcat_desc ${this.slugify(name_es)}`,
    };

    this.subcategoryService
      .updateSubcategory(
        subcategory,
        name_es,
        name_en,
        desc_es,
        desc_en,
        category_id.id
      )
      .subscribe(
        (response) => {
          this.notification.showSuccess(
            this.translate.instant('NOTIFICATIONS.SUBCATEGORY_FORM.SUCCESS_UPDATE_MESSAGE'),
            ''
          );
          this.formClose.emit();
          this.isLoading = false;
        },
        (error) => {
          this.notification.showError(
            this.translate.instant('NOTIFICATIONS.SUBCATEGORY_FORM.ERROR_UPDATE_MESSAGE'),
            ''
          );
          this.isLoading = false;
        }
      );
  }

  /**
   * Filtra las categorías según el término de búsqueda.
   */
  filterCategories(): void {
    if (!this.searchTerm) {
      this.filteredCategories = this.categories;
      return;
    }
    this.filteredCategories = this.categories.filter((category) =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Convierte un texto en un slug.
   * @param text - Texto a convertir.
   * @returns Texto convertido en slug.
   */
  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }
}
