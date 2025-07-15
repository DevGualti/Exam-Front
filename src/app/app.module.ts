import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { OrganizerDashboardComponent } from './pages/organizer-dashboard/organizer-dashboard.component';
import { EventStatisticsComponent } from './pages/event-statistics/event-statistics.component';
import { AuthInterceptor } from './utils/auth.interceptor';
import { IfAuthenticatedDirective } from './directives/if-authenticated.directive';
import { IfNotAuthenticatedDirective } from './directives/if-not-authenticated.directive';
import { IfAuthenticatedOperatorDirective } from './directives/if-authenticated-operator.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrganizerRequestsApprovalComponent } from './pages/organizer-requests-approval/organizer-requests-approval.component';
import { OrganizerCategoriesComponent } from './pages/organizer-categories/organizer-categories.component';
import { OrganizerStatisticsComponent } from './pages/organizer-statistics/organizer-statistics.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        EmployeeDashboardComponent,
        OrganizerDashboardComponent,
        EventStatisticsComponent,
        IfAuthenticatedDirective,
        IfNotAuthenticatedDirective,
        IfAuthenticatedOperatorDirective,
        NavbarComponent,
        OrganizerRequestsApprovalComponent,
        OrganizerCategoriesComponent,
        OrganizerStatisticsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideClientHydration()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
