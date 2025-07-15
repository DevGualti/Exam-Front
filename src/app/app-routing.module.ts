import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { OrganizerDashboardComponent } from './pages/organizer-dashboard/organizer-dashboard.component';
import { EventStatisticsComponent } from './pages/event-statistics/event-statistics.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmployeeGuard } from './guards/employee.guard';
import { OrganizerGuard } from './guards/organizer.guard';
import { OrganizerRequestsApprovalComponent } from './pages/organizer-requests-approval/organizer-requests-approval.component';
import { OrganizerCategoriesComponent } from './pages/organizer-categories/organizer-categories.component';
import { OrganizerStatisticsComponent } from './pages/organizer-statistics/organizer-statistics.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: EmployeeDashboardComponent, canActivate: [EmployeeGuard] },
  { path: 'organizer', component: OrganizerDashboardComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/statistics', component: OrganizerStatisticsComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/requests-approval', component: OrganizerRequestsApprovalComponent, canActivate: [OrganizerGuard] },
  { path: 'organizer/categories', component: OrganizerCategoriesComponent, canActivate: [OrganizerGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
