import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../app.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  /** If the user has submitted the form */
  isSubmitted = false;
  private intervalId: any;
  loginError = '';

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.refreshPage();
    }, 60000);
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  refreshPage(): void {
    window.location.reload();
  }
  login() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    if (!email || !password) {
      this.loginError = 'Inserisci email e password';
      return;
    }
    this.authSrv.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = err?.error?.message || 'Errore di autenticazione';
      }
    });
  }
}
