import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';
import { LoaderComponent } from '../../shared/components/loaders/loader/loader.component';
import { TranslationService } from '../../shared/services/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../services/title.service';

/**
 * Componente `SideMenuComponent`
 * 
 * Este componente maneja la lógica y la interfaz de usuario para el menú lateral de la aplicación.
 * Permite a los usuarios cambiar el idioma, cargar datos de usuario, y manejar la sesión (inicio/cierre).
 * 
 * @selector `app-side-menu`
 * @imports `CommonModule`, `RouterOutlet`, `FontAwesomeModule`, `LoaderComponent`, `RouterModule`, `TranslateModule`, `FormsModule`
 * @templateUrl `./side-menu.component.html`
 * @styleUrl `./side-menu.component.scss`
 */
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FontAwesomeModule,
    LoaderComponent,
    RouterModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  datosUsuario$: Observable<any> | undefined;
  sinfoto = 'assets/images/user.png';
  logo = 'assets/images/logo.png';
  idiomas: { value: string; label: string }[] = [
    { value: 'es', label: 'SPANISH' },
    { value: 'en', label: 'ENGLISH' },
  ];
  selectedLanguage: string | undefined;
  isLoading = false;

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private titleService: TitleService
  ) {}

  /**
   * Hook del ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos.
   * Inicializa el idioma y carga los datos del usuario si la plataforma es un navegador.
   */
  ngOnInit(): void {
    this.initializeLanguage();
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatosUsuario();
    }
  }

  /**
   * Inicializa el idioma de la aplicación obteniéndolo del localStorage o usando el idioma por defecto.
   */
  initializeLanguage() {
    const language = localStorage.getItem('lang') || this.translate.getDefaultLang();
    this.selectedLanguage = language;
    this.translate.use(language);
  }

  /**
   * Carga los datos del usuario y actualiza el estado de carga.
   */
  cargarDatosUsuario() {
    this.isLoading = true;
    this.autenticacionService.getDatosUsuario().subscribe({
      next: (datos) => {
        this.datosUsuario$ = of(datos);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Cambia el idioma de la aplicación y actualiza el título de la página.
   */
  cambiarIdioma(): void {
    const nuevoIdioma = this.selectedLanguage === 'es' ? 'en' : 'es';
    this.selectedLanguage = nuevoIdioma;
    localStorage.setItem('lang', nuevoIdioma);
    this.translate.use(nuevoIdioma);
    this.translationService.loadLanguage();
    this.translationService.loadTranslations(nuevoIdioma);
    this.titleService.updateTitle();
  }

  /**
   * Verifica si la sesión del usuario está iniciada.
   */
  isSesionIniciada(): boolean {
    return this.autenticacionService.isSesionIniciada();
  }

  /**
   * Redirige al usuario a la página de inicio de sesión.
   */
  login(): void {
    window.location.href = '/login';
  }

  /**
   * Cierra la sesión del usuario y lo redirige a la página de inicio.
   */
  logout(): void {
    this.autenticacionService.logout();
    this.router.navigate(['/home']);
  }

  /**
   * Hook del ciclo de vida que se llama después de que la vista del componente ha sido inicializada.
   * Despacha un evento personalizado indicando que el componente Angular ha sido renderizado.
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.dispatchEvent(new CustomEvent('AngularComponentRendered'));
    }
  }
}
