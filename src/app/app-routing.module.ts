import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { OrganizerDashboardComponent } from './pages/organizer-dashboard/organizer-dashboard.component';
import { EventStatisticsComponent } from './pages/event-statistics/event-statistics.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmployeeGuard } from './guards/employee.guard';
import { OrganizerGuard } from './guards/organizer.guard';
import { OrganizerCheckinComponent } from './pages/organizer-checkin/organizer-checkin.component';
import { IscrittiListComponent } from './pages/iscritti-list/iscritti-list.component';
import { IncontriListComponent } from './pages/incontri-list/incontri-list.component';
import { OrganizerIncontriListComponent } from './pages/organizer-incontri-list/organizer-incontri-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: EmployeeDashboardComponent, canActivate: [EmployeeGuard] },
  { path: 'organizer', component: OrganizerDashboardComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/statistics', component: EventStatisticsComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/checkin/:id', component: OrganizerCheckinComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/incontri', component: OrganizerIncontriListComponent, canActivate: [OrganizerGuard] },
  { path: 'iscritti', component: IscrittiListComponent, canActivate: [EmployeeGuard] },
  { path: 'incontri', component: IncontriListComponent, canActivate: [EmployeeGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
