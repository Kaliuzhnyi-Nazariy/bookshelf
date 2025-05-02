import { Component, effect, OnInit, signal } from '@angular/core';
import { Book } from '../dtos';
import { BookService } from '../api/book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookComponent } from '../book-component/book-component.component';

@Component({
  selector: 'app-fav-shelf',
  imports: [BookComponent],
  templateUrl: './fav-shelf.component.html',
  styleUrl: './fav-shelf.component.css',
})
export class FavShelfComponent {
  public listOfBooks: Book[] = [];
  public listOfFavBooks: Book[] = [];
  public chunkedList: Book[][] = [];
  private columnAmount = 7;

  constructor(private bookService: BookService, public dialog: MatDialog) {
    effect(() => {
      const books = this.bookService.books();
      this.listOfBooks = books;
      this.listOfFavBooks = this.listOfBooks.filter(
        (book) => book.favorite === true
      );
      this.chunkedList = this.chunkArray(this.listOfBooks, this.columnAmount);
    });
  }

  private chunkArray(array: Book[], columns: number): any {
    const result = [];
    const favList = [];
    try {
      for (let i = 0; i < array.length; i++) {
        if (array[i].favorite) favList.push(array[i]);
      }

      for (let i = 0; i < favList.length; i += columns) {
        result.push(favList.slice(i, i + columns));
      }
    } catch (error) {}

    return result;
  }
}
