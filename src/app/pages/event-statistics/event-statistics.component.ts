import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../services/events.service';
import { InscriptionsService, Inscription } from '../../services/inscriptions.service';

@Component({
  selector: 'app-event-statistics',
  templateUrl: './event-statistics.component.html',
  styleUrls: ['./event-statistics.component.scss']
})
export class EventStatisticsComponent implements OnInit {
  pastEvents: Event[] = [];
  inscriptions: Inscription[] = [];
  statistics: Array<{
    event: Event;
    totalInscriptions: number;
    checkIns: number;
    participationRate: number;
  }> = [];
  error: string | null = null;

  constructor(
    private eventsService: EventsService,
    private inscriptionsService: InscriptionsService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.inscriptionsService.getAllInscriptions().subscribe({
      next: (inscriptions) => {
        this.inscriptions = inscriptions;
        this.eventsService.getEvents().subscribe({
          next: (events: Event[]) => {
            const now = new Date();
            this.pastEvents = events.filter(event => new Date(event.date) < now);
            this.calculateStatistics();
          },
          error: () => this.error = 'Errore nel caricamento degli eventi'
        });
      },
      error: () => this.error = 'Errore nel caricamento delle iscrizioni'
    });
  }

  calculateStatistics() {
    this.statistics = this.pastEvents.map(event => {
      const inscriptions = this.inscriptions.filter(ins => {
        const idEvent = ins.idEvent as any;
        if (idEvent && typeof idEvent === 'object' && 'id' in idEvent) {
          return idEvent.id === event.id;
        }
        return String(idEvent) === String(event.id);
      });
      const totalInscriptions = inscriptions.length;
      const checkIns = inscriptions.filter(ins => ins.checkedIn).length;
      const participationRate = totalInscriptions > 0 ? (checkIns / totalInscriptions) * 100 : 0;
      return {
        event,
        totalInscriptions,
        checkIns,
        participationRate
      };
    });
  }
} 