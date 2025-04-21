import { inject, Injectable } from '@angular/core';
import { accessToken } from './helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseURL = 'http://localhost:3500/book';

  private http = inject(HttpClient);

  constructor() {}

  token: string | undefined = accessToken();

  checkIfToken(): void {
    console.log(this.token);
    return;
  }
}
