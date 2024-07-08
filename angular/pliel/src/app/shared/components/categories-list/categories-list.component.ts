import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { NotificationService } from '../../services/notification.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Category } from '../../../interfaces/category';
import { TranslationService } from '../../services/translation.service';
import { Subcategory } from '../../../interfaces/subcategory';
import { CategoryService } from '../../services/category.service';
import { SubcategoryFormComponent } from '../subcategory-form/subcategory-form.component';
import { SubcategoryService } from '../../services/subcategory.service';

/**
 * Componente para listar, filtrar, agregar y eliminar categorías y subcategorías.
 */
@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TranslateModule,
    ConfirmDialogModule,
    ToolbarModule,
    FileUploadModule,
    CategoryFormComponent,
    SubcategoryFormComponent
  ],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  providers: [ConfirmationService],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  filteredCategories: Category[] = [];
  selectedCategories: Category[] = [];
  selectedSubcategories: Subcategory[] = [];
  selectedCategory: Category | null = null; // Propiedad para la categoría seleccionada para edición
  selectedSubcategory: Subcategory | null = null;
  isLoading = true;
  showCategoryForm: boolean = false;
  showSubcategoryForm: boolean = false;
  expandedRows: { [key: number]: boolean } = {};

  constructor(
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private translationService: TranslationService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {}

  /**
   * Hook de inicialización del componente.
   * Carga las categorías y subcategorías.
   */
  ngOnInit(): void {
    this.loadCategories();
    this.loadSubcategories();
    this.translate.onLangChange.subscribe(() => {
      this.loadCategories();
      this.loadSubcategories();
      this.translate
        .get('primeng')
        .subscribe((res) => this.primengConfig.setTranslation(res));
    });
  }

  /**
   * Carga las categorías desde el servicio de traducción.
   */
  loadCategories(): void {
    this.isLoading = true;
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedCategories = Object.values(
          this.translationService.categorias
        ).flatMap((categoryGroup) => Object.values(categoryGroup));
        this.categories = nestedCategories.filter(
          (category) => typeof category === 'object'
        ) as Category[];
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
  }

  /**
   * Carga las subcategorías desde el servicio de traducción.
   */
  loadSubcategories(): void {
    this.translationService.loadLanguage();

    this.translationService.translations$.subscribe((translations) => {
      if (Object.keys(translations).length > 0) {
        const nestedSubcategories = Object.values(
          this.translationService.subcategorias
        );
        this.subcategories = nestedSubcategories.flatMap((subcategory) =>
          Object.values(subcategory)
        );
      }
    });

    const lang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';
    this.translationService.loadTranslations(lang);
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

  /**
   * Aplica un filtro global a las categorías.
   * @param event - Evento de entrada.
   */
  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
  
    // Función para quitar etiquetas HTML
    function stripHtml(html: string): string {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
  
    this.filteredCategories = this.categories.filter((category) => {
      const cleanedDesc = stripHtml(category.desc.toLowerCase());
      return (
        category.id.toString().includes(value) ||
        category.name.toLowerCase().includes(value) ||
        cleanedDesc.includes(value)
      );
    });
  }

  /**
   * Abre el formulario para agregar una nueva categoría.
   */
  openNewCategory(): void {
    if (this.showCategoryForm) {
      this.showCategoryForm = false;
    } else {
      this.selectedCategory = null;
      this.showCategoryForm = true;
    }
  }

  /**
   * Abre el formulario para agregar una nueva subcategoría.
   */
  openNewSubcategory(): void {
    if (this.showSubcategoryForm) {
      this.showSubcategoryForm = false;
    } else {
      this.selectedSubcategory = null;
      this.showSubcategoryForm = true;
    }
  }

  /**
   * Edita una categoría existente.
   * @param category - Categoría a editar.
   */
  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.showCategoryForm = true;
  }

  /**
   * Edita una subcategoría existente.
   * @param subcategory - Subcategoría a editar.
   */
  editSubcategory(subcategory: Subcategory): void {
    this.selectedSubcategory = subcategory;
    this.showSubcategoryForm = true;
  }

  /**
   * Confirma la eliminación de una categoría y sus subcategorías.
   * @param category - Categoría a eliminar.
   */
  confirmDelete(category: Category) {
    const subcategories = this.getSubcategories(category.id);
    const subcategoryIds = subcategories.map(sub => sub.id);

    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_CATEGORY', { name: category.name }).subscribe((message: string) => {
      this.confirmationService.confirm({
        message: message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          subcategoryIds.forEach(id => this.deleteSubcategory(id));
          this.deleteCategory(category.id);
        },
        reject: () => {
          this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_CANCELLED'), '');
        },
      });
    });
  }

  /**
   * Confirma la eliminación de las categorías seleccionadas.
   */
  confirmDeleteSelectedCategories() {
    const selectedCategoryNames = this.selectedCategories
      .map((category) => category.name)
      .join(', ');

    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_SELECTED_CATEGORIES', { names: selectedCategoryNames }).subscribe((message: string) => {
      this.confirmationService.confirm({
        message: message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          const categoryIds = this.selectedCategories
            .map((category) => category.id);
          categoryIds.forEach((id) => {
            const subcategories = this.getSubcategories(id);
            subcategories.forEach(sub => this.deleteSubcategory(sub.id));
            this.deleteCategory(id);
          });
          this.selectedCategories = [];
        },
        reject: () => {
          this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_CANCELLED'), '');
        },
      });
    });
  }

  /**
   * Elimina una categoría por su ID.
   * @param id - ID de la categoría a eliminar.
   */
  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(
      (response) => {
        this.loadCategories();
        this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_SUCCESS'), '');
      },
      (error) => {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_ERROR'), '');
      }
    );
  }

  /**
   * Confirma la eliminación de una subcategoría.
   * @param subcategory - Subcategoría a eliminar.
   */
  confirmDeleteSubcategory(subcategory: Subcategory) {
    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_SUBCATEGORY', { name: subcategory.name }).subscribe((message: string) => {
      this.confirmationService.confirm({
        message: message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          this.deleteSubcategory(subcategory.id);
        },
        reject: () => {
          this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_CANCELLED'), '');
        },
      });
    });
  }

  /**
   * Confirma la eliminación de las subcategorías seleccionadas.
   */
  confirmDeleteSelectedSubcategories() {
    const selectedSubcategoryNames = this.selectedSubcategories
      .map((subcategory) => subcategory.name)
      .join(', ');

    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_SELECTED_SUBCATEGORIES', { names: selectedSubcategoryNames }).subscribe((message: string) => {
      this.confirmationService.confirm({
        message: message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          const subcategoryIds = this.selectedSubcategories.map((subcategory) => subcategory.id);
          subcategoryIds.forEach((id) => {
            this.deleteSubcategory(id);
          });
          this.selectedSubcategories = [];
        },
        reject: () => {
          this.notificationService.showInfo(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.DELETE_CANCELLED'), '');
        },
      });
    });
  }

  /**
   * Elimina una subcategoría por su ID.
   * @param id - ID de la subcategoría a eliminar.
   */
  deleteSubcategory(id: number) {
    this.subcategoryService.deleteSubcategory(id).subscribe(
      (response) => {
        // Eliminar ese subcategory de la lista de subcategorías
        this.subcategories = this.subcategories.filter(sub => sub.id !== id);
        this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.SUBCATEGORY_DELETE_SUCCESS'), '');
        
        // MODIFICAR AL VOLVER ( SI TIENE MAS SUBCATEGORIAS CERRAR ROW )
         if (this.expandedRows[id]) {
           // Coger el getElementyId y ocultarlo
           const element = document.getElementById(`rowexpansion`);
           if (element) {
             element.style.display = 'none';
           }
         }
        
      },
      (error) => {
        this.notificationService.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.SUBCATEGORY_DELETE_ERROR'), '');
      }
    );
  }

  /**
   * Exporta las categorías a un documento PDF.
   */
  async exportCategories() {
    try {
      const doc = new jsPDF({ orientation: 'portrait', format: 'a3' });

      doc.setFontSize(22); // Tamaño de fuente para el título
      doc.setFont('helvetica', 'bold'); // Estilo de fuente para el título
      doc.text(this.translate.instant('Categories List'), doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center',
      });

      // Define las columnas y las filas
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Description', dataKey: 'desc' },
        { header: 'Subcategories', dataKey: 'subcategories' },
      ];

      const rows = this.categories.map((category) => ({
        id: category.id,
        name: category.name,
        desc: category.desc,
        subcategories: this.getSubcategories(category.id).map(sub => sub.name).join(', ')
      }));

      (doc as any).autoTable({
        head: [columns.map((col) => col.header)],
        body: rows.map((row: any) => columns.map((col) => row[col.dataKey])),
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          minCellHeight: 15,
          fillColor: [243, 234, 243], // Color #f3eaf3 for the normal rows
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
          0: { cellWidth: 20 }, // ID
          1: { cellWidth: 50 }, // Name
          2: { cellWidth: 80 }, // Description
          //3: { cellWidth: 100 }, // Subcategories
        },
        margin: { top: 20 },
      });

      // Abre el PDF en una nueva ventana para impresión
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      printWindow?.addEventListener('load', function () {
        printWindow.print();
      });

      this.notificationService.showSuccess(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.EXPORT_SUCCESS'), '');
    } catch (error) {
      this.notificationService.showError(this.translate.instant('NOTIFICATIONS.CATEGORY_LIST.EXPORT_ERROR'), '');
    }
  }

  /**
   * Limpia los filtros aplicados en la tabla.
   * @param table - Tabla de PrimeNG.
   */
  clear(table: Table): void {
    table.clear();
    this.filteredCategories = [...this.categories];
  }

  /**
   * Método para cerrar el formulario de edición de categoría desde el componente hijo.
   */
  onCategoryFormClose(): void {
    this.showCategoryForm = false;
    this.loadCategories();
  }

  /**
   * Método para cerrar el formulario de edición de subcategoría desde el componente hijo.
   */
  onSubcategoryFormClose(): void {
    this.showSubcategoryForm = false;
    this.loadSubcategories();
  }
}
