import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InscriptionsService, Inscription } from '../../services/inscriptions.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-organizer-checkin',
  templateUrl: './organizer-checkin.component.html',
  styleUrls: ['./organizer-checkin.component.scss']
})
export class OrganizerCheckinComponent implements OnInit {
  eventId: string = '';
  inscriptions: Inscription[] = [];
  users: User[] = [];
  userMap: { [id: string]: User } = {};
  error: string = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private inscriptionsService: InscriptionsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUsers();
    this.loadInscriptions();
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

  private isPopulatedEvent(event: any): event is { id: string, title: string, description: string, date: string } {
    return event && typeof event === 'object' && 'id' in event && 'title' in event && 'description' in event && 'date' in event;
  }

  loadInscriptions() {
    this.inscriptionsService.getAllInscriptions().subscribe({
      next: (all) => {
        console.log('ID evento selezionato:', this.eventId);
        console.log('Iscrizioni totali:', all);
        // Mappa _id -> id per compatibilità check-in
        const allWithId = all.map(i => ({ ...i, id: i.id || (i as any)._id }));
        const filtered = allWithId.filter(i => {
          if (this.isPopulatedEvent(i.idEvent)) {
            return i.idEvent.id === this.eventId;
          }
          return String(i.idEvent) === String(this.eventId);
        });
        console.log('Iscrizioni filtrate:', filtered);
        this.inscriptions = filtered;
      },
      error: () => this.error = 'Errore nel caricamento iscritti'
    });
  }

  getEventTitle(): string {
    const ins = this.inscriptions[0];
    if (ins && this.isPopulatedEvent(ins.idEvent)) {
      return ins.idEvent.title;
    }
    return '';
  }

  getEventDescription(): string {
    const ins = this.inscriptions[0];
    if (ins && this.isPopulatedEvent(ins.idEvent)) {
      return ins.idEvent.description;
    }
    return '';
  }

  getEventDate(): string {
    const ins = this.inscriptions[0];
    if (ins && this.isPopulatedEvent(ins.idEvent) && ins.idEvent.date) {
      return new Date(ins.idEvent.date).toLocaleDateString();
    }
    return '-';
  }

  getUserName(userId: string): string {
    const user = this.userMap[userId];
    return user ? user.name : userId;
  }

  getUserNameFromIns(ins: Inscription): string {
    if (ins.idUser && typeof ins.idUser === 'object' && 'name' in ins.idUser) {
      return (ins.idUser as any).name;
    }
    return String(ins.idUser);
  }

  getUserEmailFromIns(ins: Inscription): string {
    if (ins.idUser && typeof ins.idUser === 'object' && 'email' in ins.idUser) {
      return (ins.idUser as any).email;
    }
    return '-';
  }

  doCheckin(inscription: Inscription) {
    this.inscriptionsService.checkIn(inscription.id!).subscribe({
      next: () => this.loadInscriptions(),
      error: () => this.error = 'Errore durante il check-in'
    });
  }
} 