import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Incontro {
  partecipante1: any;
  partecipante2: any;
  giocato: boolean;
  punti1: number;
  punti2: number;
  date: string;
}

@Component({
  selector: 'app-incontri-list',
  templateUrl: './incontri-list.component.html',
  styleUrls: ['./incontri-list.component.scss']
})
export class IncontriListComponent implements OnInit {
  incontri: Incontro[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<any>(this.auth.conStr + '/api/incontri').subscribe({
      next: (res) => {
        this.incontri = (res.data || []).sort((a: Incontro, b: Incontro) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli incontri';
        this.loading = false;
      }
    });
  }
} 