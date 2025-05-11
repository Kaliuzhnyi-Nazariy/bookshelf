import { inject, Injectable, signal } from '@angular/core';
import { accessToken } from './helper';
import { AddBook, Book } from '../dtos';
import { AuthService } from './auth.service';
import { PopUpService } from '../services/pop-up.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  // private baseURL = 'http://localhost:3500/book';
  private baseURL = 'https://bookshelf-api-8c76.onrender.com/book';

  authService = inject(AuthService);
  popUpService = inject(PopUpService);

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

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);

        this.isLoading.set(false);
        throw new Error(data.message);
      }

      this.books.set(data);
      this.allBooksAmount.set(data.length);
      this.isLoading.set(false);

      return data;
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

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        return;
      }

      const oldBooks = this.books();
      this.books.set([...oldBooks, data]);
      this.allBooksAmount.set(this.allBooksAmount() + 1);

      this.isLoading.set(false);

      this.popUpService.setSuccessMessage('Book added!');
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);
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

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        return;
      }

      const oldBooks = this.books();

      const updBookIndex = oldBooks.findIndex((b) => b._id === data._id);

      if (updBookIndex !== -1) {
        const newArr = [...oldBooks];
        newArr.splice(updBookIndex, 1, data);
        this.books.set(newArr);
        this.isLoading.set(false);
      }

      this.popUpService.setSuccessMessage('Book updated!');
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);

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

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        return;
      }

      const oldBooks = this.books();
      const favIndex = oldBooks.findIndex((book) => book._id === data._id);

      if (favIndex !== -1) {
        const newArr = [...oldBooks];
        newArr.splice(favIndex, 1, data);
        this.books.set(newArr);
      }

      this.popUpService.setSuccessMessage('Book changed favorite status!');
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);

      console.log(error);
    }
  }

  async deleteBook(bookId: string) {
    this.isLoading.set(true);

    try {
      const request = await fetch(`${this.baseURL}/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await request.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        return;
      }

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

      this.popUpService.setSuccessMessage('Book deleted!');
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);

      this.isLoading.set(false);
    }
  }
}
