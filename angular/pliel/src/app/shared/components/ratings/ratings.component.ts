import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para mostrar y actualizar las valoraciones con estrellas.
 */
@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent {

  @Input() currentRate: number = 0;  // Valoración actual
  @Output() ratingChange = new EventEmitter<number>();  // Evento emitido cuando la valoración cambia

  /**
   * Constructor del componente que añade los iconos de FontAwesome.
   * @param library - Biblioteca de iconos de FontAwesome.
   */
  constructor(library: FaIconLibrary) {
    library.addIcons(faStar);
  }

  /**
   * Actualiza la valoración y emite el nuevo valor.
   * @param rating - Nueva valoración seleccionada.
   */
  updateRating(rating: number): void {
    this.currentRate = rating;
    this.ratingChange.emit(this.currentRate);
  }

}
