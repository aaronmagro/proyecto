import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TitleService } from './services/title.service';

/**
 * Componente raíz de la aplicación.
 * 
 * Este componente se encarga de inicializar la configuración principal de la aplicación y cargar los componentes esenciales como el menú lateral.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private titleService: TitleService) {}

  /**
   * Hook `ngOnInit`.
   * 
   * Inicializa el servicio de título para gestionar los títulos de las páginas.
   */
  ngOnInit(): void {
    this.titleService.init();
  }
}
