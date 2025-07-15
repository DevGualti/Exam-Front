import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmployeeGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Se c'è già l'utente, controllo subito
    const user = this.auth.getCurrentUser();
    if (user) {
      if (!user.isOperator) {
        return of(true);
      } else {
        this.router.navigate(['/login']);
        return of(false);
      }
    }
    // Se non c'è utente ma c'è token, aspetto che venga caricato
    if (this.auth.isLoggedIn()) {
      this.auth.fetchUser();
      return this.auth.currentUser$.pipe(
        filter(u => u !== null),
        first(),
        switchMap(u => {
          if (u && !u.isOperator) {
            return of(true);
          } else {
            this.router.navigate(['/login']);
            return of(false);
          }
        })
      );
    }
    // Nessun token, reindirizzo
    this.router.navigate(['/login']);
    return of(false);
  }
} 