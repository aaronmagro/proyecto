import { Component, ElementRef, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    // Asegura que el DOM del componente se haya cargado
    const contPrincipal = this.elRef.nativeElement.querySelector('.cont_principal');
    if (contPrincipal) {
      this.renderer.addClass(contPrincipal, 'cont_error_active');
    }
  }
  
}
