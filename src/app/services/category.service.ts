import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id?: string;
  descrizione: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  conStr = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{message: string, data: Category[]}>(this.conStr + '/categorie').pipe(
      map(res => res.data)
    );
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<{message: string, data: Category}>(this.conStr + '/categorie', category).pipe(
      map(res => res.data)
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<{message: string, data: Category}>(`${this.conStr}/categorie/${id}`, category).pipe(
      map(res => res.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<{message: string, data: any}>(`${this.conStr}/categorie/${id}`).pipe(
      map(() => undefined)
    );
  }
} 