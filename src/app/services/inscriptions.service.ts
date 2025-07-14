import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Inscription {
  id?: string;
  idUser: string;
  idEvent: string;
  checkedIn: boolean;
  dateCheckIn: string;
}

@Injectable({
  providedIn: 'root',
})
export class InscriptionsService {
  conStr = 'https://sim-17-06-back.onrender.com/api'; // Adatta se serve

  constructor(private http: HttpClient) {}

  addInscription(idEvent: string): Observable<Inscription> {
    return this.http.post<{message: string, data: Inscription}>(this.conStr + '/inscription', { idEvent }).pipe(
      map(res => res.data)
    );
  }

  deleteInscription(id: string): Observable<void> {
    return this.http.delete<{message: string, data: any}>(`${this.conStr}/inscription/${id}`).pipe(
      map(() => undefined)
    );
  }

  getUserInscriptions(): Observable<Inscription[]> {
    return this.http.get<{message: string, data: Inscription[]}>(this.conStr + '/inscription/mine').pipe(
      map(res => res.data)
    );
  }

  checkIn(id: string): Observable<any> {
    return this.http.put<{message: string, data: any}>(`${this.conStr}/inscription/${id}`, {}).pipe(
      map(res => res.data)
    );
  }

  getAllInscriptions(): Observable<Inscription[]> {
    return this.http.get<{message: string, data: Inscription[]}>(this.conStr + '/inscription/all').pipe(
      map(res => res.data)
    );
  }
}
