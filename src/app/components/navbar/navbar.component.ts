import { Component, HostListener } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', '../../app.component.scss']
})
export class NavbarComponent {
    user: User | null = null;
    isScrolled = false;
    isDropdownOpen = false;
    navbarLight = false;

    constructor(private authSrv: AuthService, private router: Router) {
        this.authSrv.currentUser$.subscribe(u => this.user = u);
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.navbarLight = !['/dashboard', '/'].includes(event.urlAfterRedirects.split('?')[0]);
            }
        });
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.pageYOffset > 0;
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    logout() {
        this.authSrv.logout();
    }
}
