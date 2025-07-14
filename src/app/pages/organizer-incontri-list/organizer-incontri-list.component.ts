import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Incontro {
  _id?: string;
  id?: string;
  partecipante1: any;
  partecipante2: any;
  giocato: boolean;
  punti1: number;
  punti2: number;
  date: string;
}

@Component({
  selector: 'app-organizer-incontri-list',
  templateUrl: './organizer-incontri-list.component.html',
  styleUrls: ['./organizer-incontri-list.component.scss']
})
export class OrganizerIncontriListComponent implements OnInit {
  incontri: Incontro[] = [];
  loading = false;
  error = '';
  modalOpen = false;
  modalMode: 'edit' | 'create' = 'create';
  modalData: any = {};
  usersIscritti: any[] = [];
  alertMsg: string = '';
  alertType: string = 'success';
  showAlert(msg: string, type: string = 'success') {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 2000);
  }
  overlayMsg: string = '';
  overlayType: string = 'success';
  showOverlay(msg: string, type: string = 'success') {
    this.overlayMsg = msg;
    this.overlayType = type;
    setTimeout(() => this.overlayMsg = '', 5000);
  }
  confirmDeleteId: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loadIncontri();
    this.http.get<any[]>(this.auth.conStr + '/api/auth/iscritti').subscribe({
      next: (users) => this.usersIscritti = users,
      error: () => this.usersIscritti = []
    });
  }

  loadIncontri() {
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

  openEditModal(incontro: Incontro) {
    // Trova l'incontro aggiornato nella lista
    const found = this.incontri.find(i => (i._id || i.id) === (incontro._id || incontro.id));
    const data = found ? { ...found } : { ...incontro };
    // Formatto la data per input type='datetime-local'
    if (data.date) {
      const d = new Date(data.date);
      data.date = d.toISOString().slice(0, 16);
    }
    // Estraggo solo l'id dei partecipanti se sono oggetti
    data.partecipante1 = data.partecipante1?._id || data.partecipante1?.id || data.partecipante1;
    data.partecipante2 = data.partecipante2?._id || data.partecipante2?.id || data.partecipante2;
    this.modalMode = 'edit';
    this.modalData = data;
    this.modalOpen = true;
  }

  openDeleteModal(incontro: Incontro) {
    const id = incontro._id || incontro.id;
    this.confirmDeleteId = id ? String(id) : null;
  }

  doDelete() {
    if (!this.confirmDeleteId) return;
    this.http.delete(this.auth.conStr + '/api/incontri/' + this.confirmDeleteId).subscribe({
      next: () => {
        this.showOverlay('Incontro eliminato con successo!', 'success');
        this.loadIncontri();
        this.confirmDeleteId = null;
      },
      error: () => {
        this.showAlert('Errore durante l\'eliminazione', 'danger');
        this.confirmDeleteId = null;
      }
    });
  }
  cancelDelete() {
    this.confirmDeleteId = null;
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.modalData = { date: '', partecipante1: '', partecipante2: '', punti1: 0, punti2: 0, giocato: false };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  submitModal() {
    // Validazione partecipanti diversi
    if (this.modalData.partecipante1 === this.modalData.partecipante2) {
      alert('I due partecipanti devono essere diversi!');
      return;
    }
    // Validazione punti >= 0
    if (this.modalData.punti1 < 0 || this.modalData.punti2 < 0) {
      alert('I punti devono essere numeri non negativi!');
      return;
    }
    // Validazione nessun pareggio
    if (this.modalData.giocato && this.modalData.punti1 === this.modalData.punti2) {
      alert('Una partita non può finire in pareggio!');
      return;
    }
    // Validazione regole ping-pong
    if (this.modalData.giocato) {
      const p1 = this.modalData.punti1;
      const p2 = this.modalData.punti2;
      const max = Math.max(p1, p2);
      const min = Math.min(p1, p2);
      if (max < 11) {
        alert('Il vincitore deve avere almeno 11 punti!');
        return;
      }
      if (max === 11 && min > 9) {
        alert('Se entrambi hanno almeno 10 punti, il vincitore deve avere almeno 2 punti di vantaggio!');
        return;
      }
      if (max > 11 && max - min < 2) {
        alert('Il vincitore deve avere almeno 2 punti di vantaggio!');
        return;
      }
    }
    if (this.modalMode === 'edit') {
      this.http.put(this.auth.conStr + '/api/incontri/modify/' + this.modalData.id, this.modalData).subscribe({
        next: () => {
          this.showOverlay('Incontro modificato con successo!', 'success');
          this.loadIncontri();
          this.closeModal();
        },
        error: () => alert('Errore durante la modifica')
      });
    } else {
      this.http.post(this.auth.conStr + '/api/incontri', this.modalData).subscribe({
        next: () => { this.loadIncontri(); this.closeModal(); },
        error: () => alert('Errore durante la creazione')
      });
    }
  }

  compareUser(a: any, b: any): boolean {
    if (!a || !b) return false;
    return (a._id || a.id || a) === (b._id || b.id || b);
  }
} 