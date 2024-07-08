import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BookListComponent } from '../../../shared/components/book-list/book-list.component';
import { CategoriesListComponent } from '../../../shared/components/categories-list/categories-list.component';
import { UsersListComponent } from '../../../shared/components/users-list/users-list.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente `AdminManagementComponent`
 * 
 * Este componente proporciona una interfaz de administración con pestañas para gestionar libros, categorías y usuarios.
 * 
 * @selector `app-admin-management`
 * @imports `CommonModule`, `MatTabsModule`, `BookListComponent`, `CategoriesListComponent`, `UsersListComponent`, `TranslateModule`
 * @templateUrl `./admin-management.component.html`
 * @styleUrl `./admin-management.component.scss`
 */
@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    BookListComponent,
    CategoriesListComponent,
    UsersListComponent,
    TranslateModule
  ],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.scss'
})
export class AdminManagementComponent implements AfterViewInit {

  /**
   * Método `ngAfterViewInit`
   * 
   * Este método se ejecuta después de que la vista del componente haya sido inicializada. Se encarga de
   * agregar funcionalidad de navegación por pestañas mediante la manipulación del DOM, configurando 
   * eventos de clic para los enlaces de las pestañas y controlando la visualización de su contenido correspondiente.
   */
  ngAfterViewInit() {
    // Selecciona todos los enlaces de navegación dentro de la clase 'tab-nav'.
    const tabLinks = document.querySelectorAll('.tab-nav a');
    // Selecciona todos los contenedores de contenido de pestañas dentro de la clase 'con-box'.
    const tabContents = document.querySelectorAll<HTMLElement>('.con-box');

    // Itera sobre cada enlace de navegación.
    tabLinks.forEach(link => {
      // Agrega un evento de clic a cada enlace.
      link.addEventListener('click', (e) => {
        e.preventDefault();  // Previene el comportamiento predeterminado del enlace.
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        tabLinks.forEach(nav => nav.parentElement?.classList.remove('on'));
        tabContents.forEach(content => content.style.display = 'none');
        // Si el ID del objetivo es válido, muestra el contenido del componente de la pesaña y agrega la clase 'on' al enlace clicado.
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
