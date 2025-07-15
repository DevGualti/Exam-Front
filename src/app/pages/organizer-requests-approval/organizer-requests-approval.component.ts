import { Component, OnInit } from '@angular/core';
import { RequestsService, Request } from '../../services/requests.service';

@Component({
  selector: 'app-organizer-requests-approval',
  templateUrl: './organizer-requests-approval.component.html',
  styleUrls: ['./organizer-requests-approval.component.scss']
})
export class OrganizerRequestsApprovalComponent implements OnInit {
  requests: Request[] = [];
  error: string = '';
  loadingRequests = false;
  showApproveModal = false;
  showRejectModal = false;
  requestToApprove: Request | null = null;
  requestToReject: Request | null = null;
  approveError = '';
  rejectError = '';
  approveSuccess = false;
  rejectSuccess = false;
  showDeleteRequestModal = false;
  deletingRequest: Request | null = null;
  deleteRequestError = '';
  deleteRequestSuccess = false;

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loadingRequests = true;
    this.requestsService.getRequestsToApprove().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.loadingRequests = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento richieste';
        this.loadingRequests = false;
      }
    });
  }

  approveRequest(req: Request) {
    this.requestToApprove = req;
    this.approveError = '';
    this.approveSuccess = false;
    this.showApproveModal = true;
  }

  rejectRequest(req: Request) {
    this.requestToReject = req;
    this.rejectError = '';
    this.rejectSuccess = false;
    this.showRejectModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
    this.requestToApprove = null;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.requestToReject = null;
  }

  doApproveRequest() {
    if (!this.requestToApprove) return;
    this.approveError = '';
    this.approveSuccess = false;
    this.requestsService.approveRequest(this.requestToApprove.id!).subscribe({
      next: () => {
        this.approveSuccess = true;
        this.loadRequests();
        setTimeout(() => this.closeApproveModal(), 1200);
      },
      error: (err) => {
        this.approveError = err.error?.message || 'Errore durante l\'approvazione';
      }
    });
  }

  doRejectRequest() {
    if (!this.requestToReject) return;
    this.rejectError = '';
    this.rejectSuccess = false;
    this.requestsService.rejectRequest(this.requestToReject.id!).subscribe({
      next: () => {
        this.rejectSuccess = true;
        this.loadRequests();
        setTimeout(() => this.closeRejectModal(), 1200);
      },
      error: (err) => {
        this.rejectError = err.error?.message || 'Errore durante il rifiuto';
      }
    });
  }

  confirmDeleteRequest(req: Request) {
    this.deletingRequest = req;
    this.deleteRequestError = '';
    this.deleteRequestSuccess = false;
    this.showDeleteRequestModal = true;
  }

  closeDeleteRequestModal() {
    this.showDeleteRequestModal = false;
    this.deletingRequest = null;
  }

  getUserName(idRichiedente: any): string {
    if (!idRichiedente) return '';
    if (typeof idRichiedente === 'object' && 'name' in idRichiedente) {
      return idRichiedente.name;
    }
    return idRichiedente;
  }

  doDeleteRequest() {
    if (!this.deletingRequest) return;
    this.deleteRequestError = '';
    this.deleteRequestSuccess = false;
    this.requestsService.deleteRequest(this.deletingRequest.id!).subscribe({
      next: () => {
        this.deleteRequestSuccess = true;
        this.loadRequests();
        setTimeout(() => this.closeDeleteRequestModal(), 1200);
      },
      error: (err) => {
        this.deleteRequestError = err.error?.message || 'Errore durante la cancellazione della richiesta';
      }
    });
  }
} 