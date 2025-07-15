import { Component, OnInit } from '@angular/core';
import { RequestsService, Request } from '../../services/requests.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  requests: Request[] = [];
  loadingRequests = false;
  error: string = '';

  showAddRequestModal = false;
  addRequestForm!: FormGroup;
  categories: any[] = [];
  addRequestError = '';
  addRequestSuccess = false;
  loadingCategories = false;
  submittingRequest = false;

  showEditRequestModal = false;
  editRequestForm!: FormGroup;
  editingRequest: Request | null = null;
  editRequestError = '';
  editRequestSuccess = false;

  showDeleteRequestModal = false;
  deletingRequest: Request | null = null;
  deleteRequestError = '';
  deleteRequestSuccess = false;

  constructor(
    public auth: AuthService,
    private requestsService: RequestsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initAddRequestForm();
    this.loadCategories();
    this.loadRequests();
    this.addRequestForm.get('categoria')?.valueChanges.subscribe(val => {
      console.log('Categoria selezionata:', val);
    });
  }

  openAddRequestModal() {
    this.addRequestError = '';
    this.addRequestSuccess = false;
    this.showAddRequestModal = true;
    if (this.categories.length > 0) {
      this.addRequestForm.reset({
        oggetto: '',
        categoria: null,
        quantity: 1,
        costoUnitario: 0,
        motivazione: ''
      });
    } else {
      const sub = this.requestsService.getCategories().subscribe({
        next: (cats) => {
          this.categories = cats;
          this.addRequestForm.reset({
            oggetto: '',
            categoria: null,
            quantity: 1,
            costoUnitario: 0,
            motivazione: ''
          });
          sub.unsubscribe();
        },
        error: () => {
          this.categories = [];
          sub.unsubscribe();
        }
      });
    }
  }

  closeAddRequestModal() {
    this.showAddRequestModal = false;
  }

  initAddRequestForm() {
    this.addRequestForm = this.fb.group({
      oggetto: ['', Validators.required],
      categoria: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      costoUnitario: [0, [Validators.required, Validators.min(0)]],
      motivazione: ['', Validators.required],
    });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.requestsService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        console.log('Categorie caricate:', this.categories);
        this.loadingCategories = false;
      },
      error: () => {
        this.categories = [];
        this.loadingCategories = false;
      }
    });
  }

  submitAddRequest() {
    this.addRequestError = '';
    this.addRequestSuccess = false;
    if (this.addRequestForm.invalid) {
      this.addRequestForm.markAllAsTouched();
      return;
    }
    const categoriaId = this.addRequestForm.value.categoria;
    if (!categoriaId || categoriaId === '') {
      this.addRequestError = 'Seleziona una categoria valida.';
      return;
    }
    this.submittingRequest = true;
    const payload = {
      ...this.addRequestForm.value,
      categoria: String(categoriaId),
      dataCreazione: new Date().toISOString(),
      dataApprovazione: null,
    };
    console.log('payload inviato:', payload, 'categoriaId:', categoriaId, 'form:', this.addRequestForm.value, 'categories:', this.categories);
    this.requestsService.addRequest(payload).subscribe({
      next: () => {
        this.addRequestSuccess = true;
        this.submittingRequest = false;
        this.loadRequests();
        setTimeout(() => this.closeAddRequestModal(), 1200);
      },
      error: (err) => {
        this.addRequestError = err.error?.message || 'Errore durante la creazione della richiesta';
        this.submittingRequest = false;
      }
    });
  }

  loadRequests() {
    this.loadingRequests = true;
    this.requestsService.getUserRequests().subscribe({
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

  openEditRequestModal(req: Request) {
    this.editingRequest = req;
    this.showEditRequestModal = true;
    this.editRequestForm = this.fb.group({
      oggetto: [req.oggetto, Validators.required],
      categoria: [req.categoria?.id || req.categoria?._id || req.categoria, Validators.required],
      quantity: [req.quantity, [Validators.required, Validators.min(1)]],
      costoUnitario: [req.costoUnitario, [Validators.required, Validators.min(0)]],
      motivazione: [req.motivazione, Validators.required],
    });
  }

  closeEditRequestModal() {
    this.showEditRequestModal = false;
    this.editingRequest = null;
  }

  submitEditRequest() {
    this.editRequestError = '';
    this.editRequestSuccess = false;
    if (this.editRequestForm.invalid || !this.editingRequest) {
      this.editRequestForm.markAllAsTouched();
      return;
    }
    const categoriaId = this.editRequestForm.value.categoria;
    if (!categoriaId || categoriaId === '') {
      this.editRequestError = 'Seleziona una categoria valida.';
      return;
    }
    const payload = {
      ...this.editRequestForm.value,
      categoria: String(categoriaId),
    };
    this.requestsService.updateRequest(this.editingRequest.id!, payload).subscribe({
      next: () => {
        this.editRequestSuccess = true;
        this.loadRequests();
        setTimeout(() => this.closeEditRequestModal(), 1200);
      },
      error: (err) => {
        this.editRequestError = err.error?.message || 'Errore durante la modifica della richiesta';
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

  logout() {
    this.auth.logout();
  }
} 