import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BookService } from '../api/book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookUpdModalComponent } from '../book-upd-modal/book-upd-modal.component';
import { Book } from '../dtos';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-component',
  imports: [MatIconModule],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.css',
})
export class BookComponent {
  private bookInfo = {} as Book;

  @Input() set allItem(value: Book) {
    this.bookTitle = value.title;
    this.isFavorite = value.favorite;
    this.bookInfo = value;
    if (value.imageUrl) this.bookCover = value.imageUrl;
  }

  bookTitle = '';
  bookCover = '';
  isFavorite = false;

  @Output() favoriteToggled = new EventEmitter<{
    id: string;
    liked: boolean;
  }>();

  constructor(private bookService: BookService, private dialog: MatDialog) {}

  emoji = computed(() => (!this.isFavorite ? 'favorite_border' : 'favorite'));

  onFavorite(event: MouseEvent) {
    event.stopPropagation();
    this.bookService.favoriteBook(this.bookInfo._id);
  }

  openUpdModal() {
    this.dialog.open(BookUpdModalComponent, {
      minWidth: '300px',
      maxWidth: '832px',
      data: this.bookInfo,
    });
  }
}
