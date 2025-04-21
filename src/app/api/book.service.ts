import { inject, Injectable } from '@angular/core';
import { accessToken } from './helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddBook, Book } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseURL = 'http://localhost:3500/book';

  private http = inject(HttpClient);

  constructor() {}

  token: string | undefined = accessToken();

  getBooks(): Observable<Book[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    return this.http.get<Book[]>(`${this.baseURL}`, { headers });
  }

  postBook(dto: AddBook): Observable<Book> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    return this.http.post<Book>(`${this.baseURL}`, dto, { headers });
  }

  checkIfToken(): void {
    console.log(this.token);
    return;
  }
}
