import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente de confirmación de eliminación que muestra un diálogo para ingresar la contraseña antes de confirmar la eliminación.
 */
@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {

  confirmForm: FormGroup;

  /**
   * Constructor del componente que inicializa el formulario de confirmación.
   * @param fb - FormBuilder para crear el formulario.
   * @param dialogRef - Referencia al diálogo de material.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) {
    this.confirmForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  /**
   * Método que se ejecuta al cancelar la acción. Cierra el diálogo.
   */
  onCancel(): void {
    const modalContent = document.querySelector('.modal-content');
  
    if (modalContent) {
      modalContent.classList.add('fade-out');
      this.dialogRef.close();
    }
  }

  /**
   * Método que se ejecuta al confirmar la acción. Cierra el diálogo y pasa la contraseña ingresada.
   */
  onConfirm(): void {
    if (this.confirmForm.valid) {
      this.dialogRef.close(this.confirmForm.value.password);
    }
  }
}
