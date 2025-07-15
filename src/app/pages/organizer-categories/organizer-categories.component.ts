import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer-categories',
  templateUrl: './organizer-categories.component.html',
  styleUrls: ['./organizer-categories.component.scss']
})
export class OrganizerCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  error = '';
  showAddModal = false;
  showEditModal = false;
  addForm!: FormGroup;
  editForm!: FormGroup;
  editingCategory: Category | null = null;
  addError = '';
  addSuccess = false;
  editError = '';
  editSuccess = false;
  deleteError = '';
  deleteSuccess = false;
  showDeleteModal = false;
  deletingCategory: Category | null = null;

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCategories();
    this.addForm = this.fb.group({
      descrizione: ['', Validators.required]
    });
    this.editForm = this.fb.group({
      descrizione: ['', Validators.required]
    });
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento categorie';
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.addForm.reset();
    this.addError = '';
    this.addSuccess = false;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitAdd() {
    this.addError = '';
    this.addSuccess = false;
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.categoryService.addCategory(this.addForm.value).subscribe({
      next: () => {
        this.addSuccess = true;
        this.loadCategories();
        setTimeout(() => this.closeAddModal(), 1200);
      },
      error: (err) => {
        this.addError = err.error?.message || 'Errore durante la creazione della categoria';
      }
    });
  }

  openEditModal(cat: Category) {
    this.editingCategory = cat;
    this.editForm.setValue({ descrizione: cat.descrizione });
    this.editError = '';
    this.editSuccess = false;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingCategory = null;
  }

  submitEdit() {
    if (!this.editingCategory) return;
    this.editError = '';
    this.editSuccess = false;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.categoryService.updateCategory(this.editingCategory.id!, this.editForm.value).subscribe({
      next: () => {
        this.editSuccess = true;
        this.loadCategories();
        setTimeout(() => this.closeEditModal(), 1200);
      },
      error: (err) => {
        this.editError = err.error?.message || 'Errore durante la modifica della categoria';
      }
    });
  }

  confirmDelete(cat: Category) {
    this.deletingCategory = cat;
    this.deleteError = '';
    this.deleteSuccess = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingCategory = null;
  }

  doDelete() {
    if (!this.deletingCategory) return;
    this.deleteError = '';
    this.deleteSuccess = false;
    this.categoryService.deleteCategory(this.deletingCategory.id!).subscribe({
      next: () => {
        this.deleteSuccess = true;
        this.loadCategories();
        setTimeout(() => this.closeDeleteModal(), 1200);
      },
      error: (err) => {
        this.deleteError = err.error?.message || 'Errore durante la cancellazione della categoria';
      }
    });
  }
} 