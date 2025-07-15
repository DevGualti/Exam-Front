import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrganizerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.getCurrentUser();
    if (user) {
      if (user.isOperator) {
        return of(true);
      } else {
        this.router.navigate(['/login']);
        return of(false);
      }
    }
    if (this.auth.isLoggedIn()) {
      this.auth.fetchUser();
      return this.auth.currentUser$.pipe(
        filter(u => u !== null),
        first(),
        switchMap(u => {
          if (u && u.isOperator) {
            return of(true);
          } else {
            this.router.navigate(['/login']);
            return of(false);
          }
        })
      );
    }
    this.router.navigate(['/login']);
    return of(false);
  }
} 