import { inject, Injectable, signal } from '@angular/core';
import { accessToken } from './helper';
import { AddBook, Book } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  // private baseURL = 'http://localhost:3500/book';
  private baseURL = 'https://bookshelf-api-8c76.onrender.com/book';

  constructor() {}

  books = signal<Book[]>([]);

  allBooksAmount = signal(0);

  isLoading = signal(false);

  token: string | undefined = accessToken();

  async getBooks() {
    this.isLoading.set(true);

    try {
      const request = await fetch(`${this.baseURL}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await request.json();
      this.books.set(data);
      this.allBooksAmount.set(data.length);
      this.isLoading.set(false);
    } catch (error) {
      console.error(error);
      this.isLoading.set(false);
    }
  }

  async postBook(dto: AddBook | unknown | FormData) {
    this.isLoading.set(true);
    try {
      const request = await fetch(`${this.baseURL}`, {
        method: 'POST',
        credentials: 'include',
        body: dto as FormData,
      });

      const data = await request.json();
      const oldBooks = this.books();
      this.books.set([...oldBooks, data]);
      this.allBooksAmount.set(this.allBooksAmount() + 1);

      this.isLoading.set(false);
    } catch (error) {
      console.error(error);
      this.isLoading.set(false);
    }
  }

  async updateBook(dto: AddBook | FormData, bookId: string) {
    this.isLoading.set(true);

    try {
      const request = await fetch(`${this.baseURL}/${bookId}`, {
        method: 'PUT',
        credentials: 'include',
        body: dto as FormData,
      });

      const data = await request.json();

      const oldBooks = this.books();

      const updBookIndex = oldBooks.findIndex((b) => b._id === data._id);

      if (updBookIndex !== -1) {
        const newArr = [...oldBooks];
        newArr.splice(updBookIndex, 1, data);
        this.books.set(newArr);
        this.isLoading.set(false);
      }
    } catch (error) {
      console.error(error);
      this.isLoading.set(false);
    }
  }

  async favoriteBook(bookId: string) {
    try {
      const request = await fetch(`${this.baseURL}/${bookId}/favorite`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await request.json();

      const oldBooks = this.books();
      const favIndex = oldBooks.findIndex((book) => book._id === data._id);

      if (favIndex !== -1) {
        const newArr = [...oldBooks];
        newArr.splice(favIndex, 1, data);
        this.books.set(newArr);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // deleteBook(bookId: string) {
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${this.token}`,
  //   };

  //   this.http.delete<Book>(`${this.baseURL}/${bookId}`, { headers }).subscribe({
  //     next: (book) => {
  //       if (!book) throw new Error('No user!');
  //       const fullList = this.books();
  //       const newList = fullList.filter((_book) => _book._id !== book._id);
  //       this.books.set(newList);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  async deleteBook(bookId: string) {
    this.isLoading.set(true);

    try {
      const request = await fetch(`${this.baseURL}/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await request.json();

      const allBooks = this.books();
      const delIndex = allBooks.findIndex((book) => book._id === data._id);

      if (delIndex !== -1) {
        if (!data) throw new Error('No book!');
        const fullList = this.books();
        const newList = fullList.filter((_book) => _book._id !== data._id);
        this.books.set(newList);
        this.allBooksAmount.set(this.allBooksAmount() - 1);

        this.isLoading.set(false);
      }
    } catch (error) {
      console.log(error);
      this.isLoading.set(false);
    }
  }
}
