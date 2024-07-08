import { Component, ElementRef, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra una página de error 401 (No autorizado).
 */
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {

  /**
   * Constructor del componente que inyecta las dependencias necesarias.
   * @param elRef - Referencia al elemento del DOM del componente.
   * @param renderer - Servicio para manipular el DOM de forma segura.
   */
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  /**
   * Método que se ejecuta después de que la vista del componente se haya inicializado.
   * Añade la clase 'cont_error_active' al elemento principal de contenedor de errores.
   */
  ngAfterViewInit(): void {
    const contPrincipal = this.elRef.nativeElement.querySelector('.cont_principal');
    if (contPrincipal) {
      this.renderer.addClass(contPrincipal, 'cont_error_active');
    }
  }
}
