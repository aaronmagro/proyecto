import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Componente de enlace complejo que muestra un enlace con texto y URL personalizados.
 * Este componente puede recibir un texto y una URL desde su componente padre para mostrar en el enlace.
 */
@Component({
  selector: 'app-button-complex-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-complex-link.component.html',
  styleUrls: ['./button-complex-link.component.scss']
})
export class ButtonComplexLinkComponent {
  /**
   * El texto que se mostrará en el enlace.
   * Este valor puede ser pasado desde el componente padre.
   */
  @Input() linkText: string = '';

  /**
   * La URL a la que se dirigirá el enlace.
   * Este valor puede ser pasado desde el componente padre.
   */
  @Input() linkUrl: string = '#';
}
