import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent {
  iscritto = false;
  public user: User | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
      this.iscritto = !!u?.iscritto;
    });
  }

  iscrivi() {
    this.http.post(this.auth.conStr + '/api/auth/iscrivi', {}).subscribe({
      next: () => {
        this.showAlert('Iscrizione avvenuta con successo!', 'success');
        this.auth.fetchUser();
      },
      error: (err) => {
        this.showAlert('Errore durante l\'iscrizione', 'danger');
        console.error('Errore API iscrivi:', err);
      }
    });
  }

  diventaOrganizzatore() {
    this.http.post(this.auth.conStr + '/api/auth/diventaOrganizzatore', {}).subscribe({
      next: () => {
        this.showAlert('Ora sei organizzatore!', 'success');
        this.auth.fetchUser();
      },
      error: (err) => {
        this.showAlert('Errore durante la richiesta', 'danger');
        console.error('Errore API diventaOrganizzatore:', err);
      }
    });
  }

  alertMsg: string = '';
  alertType: string = 'success';
  showAlert(msg: string, type: string = 'success') {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 2000);
  }
} 