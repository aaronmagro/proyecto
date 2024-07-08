import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonSimpleComponent } from '../../../shared/components/button-simple/button-simple.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente `TermsModalComponent`
 * 
 * Este componente muestra un modal con los términos y condiciones, permitiendo a los usuarios aceptarlos o cerrarlo.
 * 
 * @selector `app-terms-modal`
 * @imports `CommonModule`, `ButtonSimpleComponent`, `TranslateModule`
 * @templateUrl `./terms-modal.component.html`
 * @styleUrl `./terms-modal.component.scss`
 */
@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonSimpleComponent, TranslateModule]
})
export class TermsModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsModalComponent>) { }

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   */
  ngOnInit(): void {}

  /**
   * Función para cerrar el modal y enviar información sobre si se aceptaron los términos.
   * 
   * @param accepted - Indica si los términos fueron aceptados.
   */
  dismiss(accepted: boolean) {
    this.dialogRef.close({
      acceptedTerms: accepted
    });
  }

  /**
   * Función para aceptar los términos.
   */
  acceptTerms() {
    this.dismiss(true); // Se envía true al cerrar el modal
  }
}
