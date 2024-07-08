import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Componente de botón complejo que muestra un botón con texto personalizado.
 * Este componente puede recibir un texto desde su componente padre para mostrar en el botón.
 */
@Component({
  selector: 'app-button-complex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-complex.component.html',
  styleUrls: ['./button-complex.component.scss']
})
export class ButtonComplexComponent {
  /**
   * El texto que se mostrará en el botón.
   * Este valor puede ser pasado desde el componente padre.
   */
  @Input() buttonText: string = '';
}
