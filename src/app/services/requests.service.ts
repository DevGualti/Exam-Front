import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Request {
  id?: string;
  dataCreazione: string;
  dataApprovazione?: string;
  categoria: any;
  oggetto: string;
  quantity: number;
  costoUnitario: number;
  motivazione: string;
  stato: string;
  idRichiedente: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  conStr = 'https://mirko-gualtiero-esame-backend.onrender.com/api'; // Adatta se serve

  constructor(private http: HttpClient) {}

  getUserRequests(): Observable<Request[]> {
    return this.http.get<{message: string, data: Request[]}>(this.conStr + '/richieste').pipe(
      map(res => res.data)
    );
  }

  addRequest(request: Partial<Request>): Observable<Request> {
    return this.http.post<{message: string, data: Request}>(this.conStr + '/richieste', request).pipe(
      map(res => res.data)
    );
  }

  updateRequest(id: string, request: Partial<Request>): Observable<Request> {
    return this.http.put<{message: string, data: Request}>(`${this.conStr}/richieste/${id}`, request).pipe(
      map(res => res.data)
    );
  }

  deleteRequest(id: string): Observable<void> {
    return this.http.delete<{message: string, data: any}>(`${this.conStr}/richieste/${id}`).pipe(
      map(() => undefined)
    );
  }

  approveRequest(id: string): Observable<Request> {
    return this.http.post<{message: string, data: Request}>(`${this.conStr}/richieste/${id}/approva`, {}).pipe(
      map(res => res.data)
    );
  }

  rejectRequest(id: string): Observable<Request> {
    return this.http.post<{message: string, data: Request}>(`${this.conStr}/richieste/${id}/rifiuta`, {}).pipe(
      map(res => res.data)
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<{message: string, data: any[]}>(this.conStr + '/categorie').pipe(
      map(res => res.data)
    );
  }

  getRequestsToApprove(): Observable<Request[]> {
    return this.http.get<{message: string, data: Request[]}>(this.conStr + '/richieste/to-approve').pipe(
      map(res => res.data)
    );
  }

  getStats(anno: number) {
    return this.http.post<{message: string, data: any[]}>(this.conStr + '/richieste/stat', { anno }).pipe(
      map(res => res.data)
    );
  }
} 