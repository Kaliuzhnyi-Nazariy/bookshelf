import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  // private URL = 'http://localhost:3500/ai';
  private URL = 'https://bookshelf-api-8c76.onrender.com/ai';

  answers = signal<string[]>([]);
  reqErrMessage = signal<string>('');

  isLoading = signal(false);

  async fetchAnswers() {
    this.isLoading.set(true);

    try {
      const request = await fetch(this.URL, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await request.json();

      if (data.message) throw new Error(data.message);

      this.answers.set(data);
      this.isLoading.set(false);
    } catch (error) {
      console.error(error);
      this.isLoading.set(false);
    }
  }

  async getRec(booksTitle?: string[]) {
    this.isLoading.set(true);
    try {
      if (!booksTitle || booksTitle.length === 0)
        throw new Error('No books in favorite!');

      const request = await fetch(`${this.URL}/recomendations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booksTitle),
      });

      const data = await request.json();

      if (data.message) throw new Error(data.message);

      const newList = [...this.answers(), data.result];
      this.answers.set(newList);
      this.isLoading.set(false);
    } catch (error) {
      console.log(error);
      this.isLoading.set(false);
    }
  }
}
