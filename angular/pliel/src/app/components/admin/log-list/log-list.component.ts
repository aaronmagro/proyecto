import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { LogService } from '../../../shared/services/log.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';

/**
 * Componente `LogListComponent`
 * 
 * Este componente es responsable de mostrar y gestionar los registros (logs) en una tabla. 
 * Proporciona funcionalidad para filtrar, eliminar y visualizar registros.
 * 
 * @selector `app-log-list`
 * @imports `CommonModule`, `FontAwesomeModule`, `FormsModule`, `CalendarModule`, `TableModule`, `ButtonModule`, `DropdownModule`, `TranslateModule`, `ConfirmDialogModule`
 * @templateUrl `./log-list.component.html`
 * @styleUrls `['./log-list.component.scss']`
 * @providers `ConfirmationService`
 */
@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    TranslateModule,
    ConfirmDialogModule
  ],
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
  providers: [ConfirmationService],
})
export class LogListComponent implements OnInit {
  logs: any[] = [];
  faCheckCircle = faCheckCircle;
  faExclamationTriangle = faExclamationTriangle;
  faTimesCircle = faTimesCircle;
  statuses: { label: string, value: string }[] = [];
  selectedStatus: string = '';
  firstDate: Date | null = null;
  secondDate: Date | null = null;
  currentPage: number = 1;
  rows: number = 10;
  ipFilter: string = ''; // Nueva variable para el filtro de IP

  constructor(
    private logService: LogService,
    private notification: NotificationService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {}

  /**
   * Método `ngOnInit`
   * 
   * Inicializa el componente cargando los registros y configurando las traducciones.
   */
  ngOnInit(): void {
    this.loadLogs();
    this.translate.get('STATUS').subscribe((status: any) => {
      this.statuses = [
        { label: status.ALL, value: '' },
        { label: status.SUCCESS, value: 'success' },
        { label: status.WARNING, value: 'warning' },
        { label: status.ERROR, value: 'error' },
        { label: status.INFO, value: 'info' }
      ];
    });
    this.translate.onLangChange.subscribe(() => {
      this.translate
        .get('primeng')
        .subscribe((res) => this.primengConfig.setTranslation(res));
    });
  }

  /**
   * Método `loadLogs`
   * 
   * Carga los registros (logs) desde el servicio de logs.
   */
  loadLogs(): void {
    this.logService.getLogs().subscribe(
      (data) => {
        this.logs = data.map((log: { created_at: Date; }) => ({
          ...log,
          created_at: new Date(log.created_at) 
        }));
      },
      (error) => {
        this.translate.get('NOTIFICATIONS.LOGS.LOAD_ERROR').subscribe((res: string) => {
          this.notification.showError(res, 'Error');
        });
      }
    );
  }

  /**
   * Método `deleteLog`
   * 
   * Elimina un registro específico después de la confirmación del usuario.
   * 
   * @param id El ID del registro a eliminar.
   */
  deleteLog(id: number): void {
    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_LOG').subscribe((message: string) => {
      this.confirmationService.confirm({
        message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          this.logService.deleteLog(id).subscribe(
            (data) => {
              this.translate.get('NOTIFICATIONS.LOGS.DELETE_SUCCESS').subscribe((res: string) => {
                this.notification.showSuccess(res, 'Success');
                this.loadLogs();
              });
            },
            (error) => {
              this.translate.get('NOTIFICATIONS.LOGS.DELETE_ERROR').subscribe((res: string) => {
                this.notification.showError(res, 'Error');
              });
            }
          );
        },
        reject: () => {
          this.translate.get('NOTIFICATIONS.LOGS.DELETE_CANCELLED').subscribe((res: string) => {
            this.notification.showInfo(res, 'Info');
          });
        },
      });
    });
  }

  /**
   * Método `clear`
   * 
   * Limpia los filtros de la tabla.
   * 
   * @param table La tabla de PrimeNG a limpiar.
   */
  clear(table: Table): void {
    table.clear();
  }

  /**
   * Método `deleteAllLogs`
   * 
   * Elimina todos los registros después de la confirmación del usuario.
   */
  deleteAllLogs(): void {
    this.translate.get('NOTIFICATIONS.CONFIRM.DELETE_ALL_LOGS').subscribe((message: string) => {
      this.confirmationService.confirm({
        message,
        header: this.translate.instant('NOTIFICATIONS.CONFIRM.HEADER'),
        icon: this.translate.instant('NOTIFICATIONS.CONFIRM.ICON'),
        accept: () => {
          this.logService.deleteAllLogs().subscribe(
            (data) => {
              this.translate.get('NOTIFICATIONS.LOGS.DELETE_ALL_SUCCESS').subscribe((res: string) => {
                this.notification.showSuccess(res, 'Success');
                this.loadLogs();
              });
            },
            (error) => {
              this.translate.get('NOTIFICATIONS.LOGS.DELETE_ALL_ERROR').subscribe((res: string) => {
                this.notification.showError(res, 'Error');
              });
            }
          );
        },
        reject: () => {
          this.translate.get('NOTIFICATIONS.LOGS.DELETE_CANCELLED').subscribe((res: string) => {
            this.notification.showInfo(res, 'Info');
          });
        },
      });
    });
  }

  /**
   * Método `getLogClass`
   * 
   * Devuelve la clase CSS correspondiente al estado del registro.
   * 
   * @param log El registro para el cual se determina la clase CSS.
   * @returns La clase CSS correspondiente al estado del registro.
   */
  getLogClass(log: any): string {
    switch (log.status) {
      case 'success':
        return 'log-success';
      case 'warning':
        return 'log-warning';
      case 'error':
        return 'log-error';
      default:
        return '';
    }
  }

  /**
   * Método `getLogIcon`
   * 
   * Devuelve el icono correspondiente al estado del registro.
   * 
   * @param log El registro para el cual se determina el icono.
   * @returns El icono correspondiente al estado del registro.
   */
  getLogIcon(log: any): IconDefinition {
    switch (log.status) {
      case 'success':
        return this.faCheckCircle;
      case 'warning':
        return this.faExclamationTriangle;
      case 'error':
        return this.faTimesCircle;
      default:
        return this.faExclamationTriangle;
    }
  }

  /**
   * Método `filterLogs`
   * 
   * Filtra los registros según el estado seleccionado, las fechas y el filtro de IP.
   * 
   * @returns Los registros filtrados.
   */
  filterLogs(): any[] {
    let filteredLogs = this.logs;
    if (this.selectedStatus) {
      filteredLogs = filteredLogs.filter(log => log.status === this.selectedStatus);
    }
    if (this.firstDate && this.secondDate) {
      const startDate = new Date(this.firstDate);
      const endDate = new Date(this.secondDate);
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate >= startDate && logDate <= endDate;
      });
    }
    if (this.ipFilter) {
      filteredLogs = filteredLogs.filter(log => log.ip_address.includes(this.ipFilter));
    }
    return filteredLogs;
  }
}
