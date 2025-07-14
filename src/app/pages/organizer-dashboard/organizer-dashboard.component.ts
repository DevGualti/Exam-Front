import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../services/events.service';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
  events: Event[] = [];
  showForm = false;
  isEdit = false;
  form: Partial<Event> = {};
  error: string = '';
  loading = false;
  users: User[] = [];
  userMap: { [id: string]: User } = {};

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadUsers();
  }

  loadUsers() {
    this.authService.fetchAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userMap = {};
        for (const u of users) {
          this.userMap[u.id!] = u;
        }
      },
      error: () => this.error = 'Errore nel caricamento utenti'
    });
  }

  loadEvents() {
    this.loading = true;
    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento eventi';
        this.loading = false;
      }
    });
  }

  openForm(event?: Event) {
    this.showForm = true;
    this.isEdit = !!event;
    this.form = event ? { ...event } : {};
  }

  closeForm() {
    this.showForm = false;
    this.form = {};
    this.isEdit = false;
  }

  saveEvent() {
    if (!this.form.title || !this.form.date || !this.form.description) {
      this.error = 'Compila tutti i campi';
      return;
    }
    this.error = '';
    if (this.isEdit && this.form.id) {
      this.eventsService.updateEvent(this.form.id, this.form).subscribe({
        next: () => { this.loadEvents(); this.closeForm(); },
        error: () => this.error = 'Errore durante la modifica evento'
      });
    } else {
      this.eventsService.addEvent(this.form).subscribe({
        next: () => { this.loadEvents(); this.closeForm(); },
        error: () => this.error = 'Errore durante la creazione evento'
      });
    }
  }

  deleteEvent(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo evento?')) return;
    this.eventsService.deleteEvent(id).subscribe({
      next: () => this.loadEvents(),
      error: () => this.error = 'Errore durante l\'eliminazione evento'
    });
  }

  // Navigazione check-in
  goToCheckin(event: Event) {
    this.router.navigate(['/organizer/checkin', event.id]);
  }

  canCheckin(event: Event): boolean {
    const today = new Date().toISOString().split('T')[0];
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    return eventDate > today;
  }

  getUserName(userId: string): string {
    const user = this.userMap[userId];
    return user ? user.name : userId;
  }
} 