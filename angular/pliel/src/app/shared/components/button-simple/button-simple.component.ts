import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Componente de botón simple que muestra un botón con texto personalizado.
 * Este componente puede recibir un texto desde su componente padre para mostrar en el botón.
 */
@Component({
  selector: 'app-button-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-simple.component.html',
  styleUrls: ['./button-simple.component.scss']
})
export class ButtonSimpleComponent {
  /**
   * El texto que se mostrará en el botón.
   * Este valor puede ser pasado desde el componente padre.
   */
  @Input() buttonText: string = '';
}
