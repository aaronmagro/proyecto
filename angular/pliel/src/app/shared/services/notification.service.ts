import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  /**
   * Muestra una notificación de éxito.
   * @param message - El mensaje a mostrar.
   * @param title - El título de la notificación. Por defecto es 'Success'.
   */
  showSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      timeOut: 5000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 5000,
    });
  }

  /**
   * Muestra una notificación de error.
   * @param message - El mensaje a mostrar.
   * @param title - El título de la notificación. Por defecto es 'Error'.
   */
  showError(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      timeOut: 5000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 5000,
    });
  }

  /**
   * Muestra una notificación informativa.
   * @param message - El mensaje a mostrar.
   * @param title - El título de la notificación. Por defecto es 'Info'.
   */
  showInfo(message: string, title: string = 'Info') {
    this.toastr.info(message, title, {
      timeOut: 7000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 5000,
    });
  }

  /**
   * Muestra una notificación de advertencia.
   * @param message - El mensaje a mostrar.
   * @param title - El título de la notificación. Por defecto es 'Warning'.
   */
  showWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      timeOut: 5000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 5000,
    });
  }
}
