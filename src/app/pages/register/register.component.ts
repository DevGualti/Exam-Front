import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../../app.component.scss'],
})
export class RegisterComponent {

    registrationSuccess = false;
    isSubmitted = false;
    registerError = '';

    signUpForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmpassword: ['', Validators.required],
    }, { validators: this.matchPasswordValidator() }); // <--- aggiungi qui


    constructor(protected fb: FormBuilder,
        protected authSrv: AuthService,
        protected router: Router
    ) { }

    matchPasswordValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const password = group.get('password')?.value;
            const confirmpassword = group.get('confirmpassword')?.value;
            return this.checkMatchPassword(password, confirmpassword) ? null : { passwordMismatch: true };
        };
    }

    private checkMatchPassword(password: string | null = null, confPassword: string | null = null) {
        return password === confPassword;
    }

    registerSubmit() {
        this.registerError = '';
        this.isSubmitted = true;

        if (this.signUpForm.valid) {
            const { name, email, password } = this.signUpForm.value;
            this.authSrv.register(name!, email!, password!)
                .pipe(
                    catchError(err => {
                        this.registerError = err.error.error || "Errore durante la registrazione";
                        return throwError(() => err);
                    })
                )
                .subscribe(user => {
                    if (user) {
                        this.registrationSuccess = true;
                    }
                });
        } else {
            if (this.signUpForm.errors?.['passwordMismatch']) {
                this.registerError = "Le password non coincidono";
                // password and confirmpassword input to invalid
                this.signUpForm.get('password')?.setErrors({ invalid: true });
                this.signUpForm.get('confirmpassword')?.setErrors({ invalid: true });
            }
        }
    }

}
