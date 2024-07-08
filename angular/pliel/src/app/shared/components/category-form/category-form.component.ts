import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../../interfaces/category';
import { CommonModule } from '@angular/common';
import { MainLoaderComponent } from '../loaders/main-loader/main-loader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { CategoryService } from '../../services/category.service';

/**
 * Componente para el formulario de creación y edición de categorías.
 */
@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    MainLoaderComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null; // Recibe la categoría desde el componente padre
  @Output() formClose = new EventEmitter<void>(); // Emite un evento al cerrar el formulario
  categoryForm: FormGroup; // Formulario reactivo para la categoría
  isLoading = false; // Indicador de estado de carga
  selectedTab: string = 'category'; // Pestaña seleccionada

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
    private categoryService: CategoryService,
    private translate: TranslateService
  ) {
    this.categoryForm = this.fb.group({
      name_es: ['', Validators.required],
      name_en: ['', Validators.required],
      desc_es: ['', Validators.required],
      desc_en: ['', Validators.required],
    });
  }

  /**
   * Hook de inicialización del componente.
   * Carga las traducciones de la categoría si se ha proporcionado una.
   */
  ngOnInit(): void {
    if (this.category) {
      this.loadCategoryTranslations();
    }
  }

  /**
   * Carga las traducciones de la categoría desde el servicio.
   */
  loadCategoryTranslations(): void {
    this.isLoading = true;
    if (this.category) {
      this.categoryService.showCategoryTranslations(this.category.id).subscribe(
        (response) => {
          this.categoryForm.patchValue({
            name_es: response.name_es,
            name_en: response.name_en,
            desc_es: response.desc_es,
            desc_en: response.desc_en,
          });
          this.isLoading = false;
        },
        (error) => {
          this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.LOAD_ERROR'), '');
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Guarda una nueva categoría.
   */
  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.REQUIRED_FIELDS_ERROR'), '');
      return;
    }
    const { name_es, name_en, desc_es, desc_en } = this.categoryForm.value;

    const category: Category = {
      ...this.category,
      ...this.categoryForm.value,
      name: `cat_name ${this.slugify(name_es)}`,
      desc: `cat_desc ${this.slugify(name_es)}`,
    };
    this.isLoading = true;

    this.categoryService.saveCategory(name_es, name_en, desc_es, desc_en).subscribe(
      (response) => {
        this.notification.showSuccess(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.SAVE_SUCCESS'), '');
        this.formClose.emit();
        this.isLoading = false;
      },
      (error) => {
        this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.SAVE_ERROR'), '');
        this.isLoading = false;
      }
    );
  }

  /**
   * Actualiza una categoría existente.
   */
  updateCategory(): void {
    if (!this.category) {
      this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.UPDATE_ERROR'), '');
      return;
    }

    if (this.categoryForm.invalid) {
      this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.REQUIRED_FIELDS_ERROR'), '');
      return;
    }

    const { name_es, name_en, desc_es, desc_en } = this.categoryForm.value;

    const category: Category = {
      ...this.category,
      ...this.categoryForm.value,
      name: `cat_name ${this.slugify(name_es)}`,
      desc: `cat_desc ${this.slugify(name_es)}`,
    };
    this.isLoading = true;

    this.categoryService.updateCategory(category, name_es, name_en, desc_es, desc_en).subscribe(
      (response) => {
        this.notification.showSuccess(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.UPDATE_SUCCESS'), '');
        this.formClose.emit();
        this.isLoading = false;
      },
      (error) => {
        this.notification.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_FORM.UPDATE_ERROR'), '');
        this.isLoading = false;
      }
    );
  }

  /**
   * Convierte un texto en una versión "slug" (sin espacios y caracteres especiales).
   * @param text - El texto a convertir.
   * @returns El texto convertido en formato "slug".
   */
  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }
}
