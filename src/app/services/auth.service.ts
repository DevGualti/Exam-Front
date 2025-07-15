import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs"
import { JwtService } from "./jwt.service";

export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    isOperator: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._currentUser$.asObservable();

    conStr: string = "http://localhost:3001"

    constructor(private jwtSrv: JwtService,
        private http: HttpClient,
        private router: Router) {
        this.fetchUser();
    }

    isLoggedIn() {
        return this.jwtSrv.hasToken();
    }

    login(email: string, password: string) {
        return this.http.post<{ user: User, token: string }>(this.conStr + '/api/auth/login', { email, password })
            .pipe(
                tap(res => this.jwtSrv.setToken(res.token)),
                tap(res => this._currentUser$.next(res.user)),
                map(res => res.user)
            );
    }

    register(name: string, email: string, password: string, isOperator: boolean = false, isVerified: boolean = false) {
        return this.http.post<User>(this.conStr + '/api/auth/register', { name, email, password, isOperator, isVerified });
    }

    logout() {
        this.jwtSrv.removeToken();
        this._currentUser$.next(null);
        this.router.navigate(['/login']);
    }


    fetchUser() {
        this.http.get<User>(this.conStr + '/api/auth/me')
            .subscribe(user => this._currentUser$.next(user));
    }

    fetchUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.conStr + '/api/auth/all');
    }

    editUser(user: User): Observable<User> {
        return this.http.put<User>(this.conStr + '/api/auth/modify/' + user.id, user);
    }

    getCurrentUser(): User | null {
        return this._currentUser$.getValue();
    }

    fetchAllUsers() {
        return this.http.get<User[]>(this.conStr + '/api/auth/all');
    }
}
