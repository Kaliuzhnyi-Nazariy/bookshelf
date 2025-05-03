import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { accessToken as at } from './helper';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  // private URL = 'http://localhost:3500/ai';
  private URL = 'https://bookshelf-api-8c76.onrender.com/ai';

  private http = inject(HttpClient);

  answers = signal<string[]>([]);
  reqErrMessage = signal<string>('');

  isLoading = signal(false);

  token = at();

  fetchAnswers() {
    this.isLoading.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });

    this.http.get<string[]>(this.URL, { headers }).subscribe({
      next: (answers) => {
        this.answers.set(answers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.reqErrMessage.set(err.error.message);
        this.isLoading.set(false);
      },
    });
  }

  getRec(booksTitle?: string[]) {
    this.isLoading.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    if (booksTitle) {
      this.http
        .post<{ result: string }>(`${this.URL}/recomendations`, booksTitle, {
          headers,
        })
        .subscribe({
          next: (ans: { result: string }) => {
            const newList = [...this.answers(), ans.result];
            this.answers.set(newList);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.reqErrMessage.set(err.error.message || 'An error occurred');
            this.isLoading.set(false);
          },
        });
    }
  }
}
