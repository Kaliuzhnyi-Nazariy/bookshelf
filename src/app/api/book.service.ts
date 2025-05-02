import { inject, Injectable, signal } from '@angular/core';
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

  books = signal<Book[]>([]);

  isLoading = signal(false);

  token: string | undefined = accessToken();

  getBooks() {
    this.isLoading.set(true);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    this.http.get<Book[]>(`${this.baseURL}`, { headers }).subscribe({
      next: (books) => {
        this.books.set(books);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch books:', error);
        this.isLoading.set(false);
      },
    });
  }

  // postBook(dto: AddBook | unknown): Observable<Book> {
  postBook(dto: AddBook | unknown) {
    const headers = {
      // // 'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${this.token}`,
    };

    this.http.post<Book>(`${this.baseURL}`, dto, { headers }).subscribe({
      next: (v) => {
        const oldBooks = this.books();
        this.books.set([...oldBooks, v]);
      },
    });
  }

  // updateBook(dto: AddBook | unknown, bookId: string): Observable<Book> {
  updateBook(dto: AddBook | unknown, bookId: string) {
    this.isLoading.set(true);

    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    this.http
      .put<Book>(`${this.baseURL}/${bookId}`, dto, { headers })
      .subscribe({
        next: (book) => {
          const oldBooks = this.books();

          const updBookIndex = oldBooks.findIndex((b) => b._id === book._id);

          if (updBookIndex !== -1) {
            const newArr = [...oldBooks];
            newArr.splice(updBookIndex, 1, book);
            this.books.set(newArr);
            this.isLoading.set(false);
          }
        },
      });
  }

  // favoriteBook(bookId: string): Observable<Book> {
  favoriteBook(bookId: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    this.http
      .patch<Book>(
        `${this.baseURL}/${bookId}/favorite`,
        {},
        {
          headers,
        }
      )
      .subscribe({
        next: (value) => {
          const oldBooks = this.books();

          const changedBookStatusIndex = oldBooks.findIndex(
            (book) => book._id === value._id
          );

          if (changedBookStatusIndex !== -1) {
            const newArr = [...oldBooks];
            newArr.splice(changedBookStatusIndex, 1, value);
            this.books.set(newArr);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteBook(bookId: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };

    this.http.delete<Book>(`${this.baseURL}/${bookId}`, { headers }).subscribe({
      next: (book) => {
        if (!book) throw new Error('No user!');
        const fullList = this.books();
        const newList = fullList.filter((_book) => _book._id !== book._id);
        this.books.set(newList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
