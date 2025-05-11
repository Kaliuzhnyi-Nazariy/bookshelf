import {
  AfterContentInit,
  Component,
  computed,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { AiService, AuthService } from '../api';
import { BookService } from '../api/book.service';
import { Book } from '../dtos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterContentInit {
  books: Book[] = [];
  answers = signal<string[]>([]);
  favoriteBooks = signal<Book[]>([]);

  isDisabled = computed(() => this.favoriteBooks().length === 0);

  isLoading = signal(false);

  isLoggedIn = signal(false);

  isAnswerFetched = signal(false);

  constructor(
    private AIService: AiService,
    private bookService: BookService,
    private authService: AuthService
  ) {
    effect(() => {
      this.isLoggedIn.set(this.authService.authStatus());

      if (this.isLoggedIn() && !this.isAnswerFetched()) {
        this.isAnswerFetched.set(true);
        this.AIService.fetchAnswers();
        this.getAnswers();
      }

      if (this.isLoggedIn()) {
        this.getAnswers();
      }

      if (!this.isLoggedIn()) {
        this.isAnswerFetched.set(false);
        this.answers.set([]);
      }
    });
    // this.authService.authStatus.subscribe({
    //   next: (val) => this.isLoggedIn.set(val),
    // });
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.AIService.fetchAnswers();

      this.books = this.bookService.books();

      this.favoriteBooks.set(
        this.books.filter((book) => book.favorite === true)
      );
      this.answers.set(this.AIService.answers());
      this.isLoading.set(this.AIService.isLoading());
    }
  }

  ngAfterContentInit(): void {
    if (this.isLoggedIn()) {
      this.AIService.fetchAnswers();
    }
  }

  async getAnswers() {
    if (this.isLoggedIn()) {
      this.books = this.bookService.books();

      this.favoriteBooks.set(
        this.books.filter((book) => book.favorite === true)
      );
      this.answers.set(this.AIService.answers());
      this.isLoading.set(this.AIService.isLoading());
    }
  }

  onAsk() {
    try {
      const booksTitle: string[] = [];
      this.favoriteBooks().forEach((book) => {
        booksTitle.push(book.title);
      });
      this.AIService.getRec(booksTitle);
    } catch (error) {
      console.error(error);
    }
  }
}
