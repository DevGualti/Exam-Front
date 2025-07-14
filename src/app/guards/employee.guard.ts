import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmployeeGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    // Permetti l'accesso a tutti gli utenti autenticati
    const user = (this.auth as any)._currentUser$.getValue() as User | null;
    if (user) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
} 