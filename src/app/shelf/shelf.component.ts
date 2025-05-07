import { Component, effect, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookUpdModalComponent } from '../book-upd-modal/book-upd-modal.component';
import { BookService } from '../api/book.service';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import { Book } from '../dtos';
import { BookComponent } from '../book-component/book-component.component';
import { AuthService } from '../api';

@Component({
  selector: 'app-shelf',
  imports: [BookComponent],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.css',
})
export class ShelfComponent implements OnInit {
  public listOfBooks: Book[] = [];
  public chunkedList: Book[][] = [];
  private columnAmount = 7;

  isLoggedIn = signal(false);

  isLoading = signal(false);
  errorFetch = signal('');

  constructor(
    public dialog: MatDialog,
    private bookService: BookService,
    private authService: AuthService
  ) {
    effect(() => {
      this.listOfBooks = this.bookService.books();
      this.chunkedList = this.chunkArray(this.listOfBooks, this.columnAmount);
    });
    this.authService.authStatus.subscribe({
      next: (val) => this.isLoggedIn.set(val),
    });
  }

  ngOnInit(): void {
    this.bookService.getBooks();
  }

  private chunkArray(array: Book[], columns: number): any[][] {
    const result = [];

    let unfavArr = [];

    for (let i = 0; i < array.length; i++) {
      if (!array[i].favorite) {
        unfavArr.push(array[i]);
      }
    }

    const fullList = [...unfavArr, { title: 'add' } as Book];

    for (let i = 0; i < fullList.length; i += columns) {
      result.push(fullList.slice(i, i + columns));
    }

    return result;
  }

  openUpdModal(item: Book) {
    const dialogRef = this.dialog.open(BookUpdModalComponent, {
      width: '832px',
      maxWidth: '832px',
      data: item,
    });

    dialogRef.afterClosed().subscribe({
      next: () => {},
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(AddBookModalComponent, {
      minWidth: '300px',
      maxWidth: '832px',
    });

    dialogRef.afterClosed().subscribe({
      next: () => {},
    });
  }

  onFavoriteBook(event: { id: string; liked: boolean }) {
    const bookInd = this.listOfBooks.findIndex((book) => book._id === event.id);
    if (bookInd !== -1) {
      this.listOfBooks[bookInd].favorite = event.liked;
      this.chunkedList = this.chunkArray(this.listOfBooks, this.columnAmount);
    }
  }
}
