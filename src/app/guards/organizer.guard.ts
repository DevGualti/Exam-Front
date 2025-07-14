import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class OrganizerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    const user = this.auth.getCurrentUser();
    if (user && user.isOperator) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
} 