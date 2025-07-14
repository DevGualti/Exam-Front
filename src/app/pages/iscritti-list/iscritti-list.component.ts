import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';

interface UserStats extends User {
  partiteGiocate: number;
  partiteVinte: number;
  percentualeVittorie: number;
}

interface Incontro {
  partecipante1: any;
  partecipante2: any;
  giocato: boolean;
  punti1: number;
  punti2: number;
}

@Component({
  selector: 'app-iscritti-list',
  templateUrl: './iscritti-list.component.html',
  styleUrls: ['./iscritti-list.component.scss']
})
export class IscrittiListComponent implements OnInit {
  iscritti: UserStats[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.http.get<User[]>(this.auth.conStr + '/api/auth/iscritti').toPromise(),
      this.http.get<any>(this.auth.conStr + '/api/incontri').toPromise()
    ]).then(([users, incontriRes]) => {
      const incontri: Incontro[] = incontriRes.data || [];
      console.log('Tutti gli incontri:', incontri);
      const stats: UserStats[] = (users || []).map(u => {
        const giocate = incontri.filter(i =>
          i.giocato &&
          (String(i.partecipante1?.id) === String(u.id) || String(i.partecipante2?.id) === String(u.id))
        );
        const vinte = giocate.filter(i =>
          (String(i.partecipante1?.id) === String(u.id) && i.punti1 > i.punti2) ||
          (String(i.partecipante2?.id) === String(u.id) && i.punti2 > i.punti1)
        );
        const partiteGiocate = giocate.length;
        const partiteVinte = vinte.length;
        const percentualeVittorie = partiteGiocate > 0 ? Math.round((partiteVinte / partiteGiocate) * 100) : 0;
        return { ...u, partiteGiocate, partiteVinte, percentualeVittorie };
      });
      const min5 = stats.filter(u => u.partiteGiocate >= 5).sort((a, b) => b.percentualeVittorie - a.percentualeVittorie);
      const meno5 = stats.filter(u => u.partiteGiocate < 5);
      this.iscritti = [...min5, ...meno5];
      console.log('Classifica iscritti:', this.iscritti);
      this.loading = false;
    }).catch(() => {
      this.error = 'Errore nel caricamento degli iscritti o incontri';
      this.loading = false;
    });
  }
} 