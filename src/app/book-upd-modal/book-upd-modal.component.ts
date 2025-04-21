import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../api/book.service';

@Component({
  selector: 'app-book-upd-modal',
  imports: [],
  templateUrl: './book-upd-modal.component.html',
  styleUrl: './book-upd-modal.component.css',
})
export class BookUpdModalComponent {
  constructor(
    public dialog: MatDialogRef<BookUpdModalComponent>,
    private bookService: BookService
  ) {}

  itemName = signal('');

  onSubmit(): void {
    this.bookService.checkIfToken();
  }
}
