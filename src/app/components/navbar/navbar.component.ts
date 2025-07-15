import { Component, HostListener, Input, Output } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss', '../../app.component.scss']
})
export class NavbarComponent {

    @Input()
    user: User | null = null;

    isScrolled = false;
    isDropdownOpen = false;

    constructor(private authSrv: AuthService) { }

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
