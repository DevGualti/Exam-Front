import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Event {
  id?: string;
  title: string;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  conStr = 'https://sim-17-06-back.onrender.com/api'; // Adatta se serve

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<{message: string, data: Event[]}>(this.conStr + '/event').pipe(
      map(res => res.data)
    );
  }

  addEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<{message: string, data: Event}>(this.conStr + '/event', event).pipe(
      map(res => res.data)
    );
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    const { id: _, ...eventWithoutId } = event as any;
    const formattedEvent = { ...eventWithoutId };
    if (formattedEvent.date) {
      const date = new Date(formattedEvent.date);
      date.setHours(0, 0, 0, 0);
      formattedEvent.date = date.toISOString();
    }
    return this.http.put<{message: string, data: Event}>(`${this.conStr}/event/modify/${id}`, formattedEvent).pipe(
      map(res => res.data)
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<{message: string, data: any}>(`${this.conStr}/event/${id}`).pipe(
      map(() => undefined)
    );
  }

  getEventStatistics(dal: string, al: string): Observable<any> {
    return this.http.get<{message: string, data: any}>(`${this.conStr}/event/statistics?dal=${dal}&al=${al}`).pipe(
      map(res => res.data)
    );
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<{message: string, data: Event}>(`${this.conStr}/event/${id}`).pipe(
      map(res => res.data)
    );
  }

  getUserInscriptions(): Observable<Event[]> {
    return this.http
      .get<{ message: string; data: Event[] }>(
        this.conStr + '/api/inscriptions/mine'
      )
      .pipe(
        // Extract only the Data property
        map((response) => response.data)
      );
  }
}
