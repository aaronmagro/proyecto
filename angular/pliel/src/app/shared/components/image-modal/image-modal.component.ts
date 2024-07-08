import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente modal para mostrar una imagen.
 */
@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {

  /**
   * Constructor del componente que inyecta los datos del modal.
   * @param data - Datos inyectados en el modal, incluyendo la URL de la imagen.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { image: string }) { }

}
