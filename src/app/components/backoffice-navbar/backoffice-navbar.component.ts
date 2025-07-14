import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// Importa il tuo vero AuthService. Questo è un esempio.
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-backoffice-navbar',
  templateUrl: './backoffice-navbar.component.html',
  styleUrls: ['./backoffice-navbar.component.scss']
})
export class BackofficeNavbarComponent {

  public isDropdownOpen = false;

  constructor(
    private elementRef: ElementRef, // Necessario per chiudere il menu al click esterno
    private authSrv: AuthService,
    private router: Router
  ) {}

  /**
   * Gestisce il click sull'intero documento per chiudere il dropdown
   * se il click avviene al di fuori del componente del menu.
   * @param event L'evento del mouse.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }

  /**
   * Apre e chiude il menu a tendina.
   * event.stopPropagation() previene la chiusura immediata dal HostListener.
   * @param event L'evento del mouse.
   */
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Impedisce al click di raggiungere il 'document'
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Chiude esplicitamente il menu.
   */
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  /**
   * Esegue il logout chiamando il servizio di autenticazione.
   */
  logout(): void {
    this.closeDropdown(); // Chiude il menu
    this.authSrv.logout(); // Esegue il logout tramite il servizio
    // Il servizio di logout dovrebbe gestire il redirect alla pagina di login.
  }
}