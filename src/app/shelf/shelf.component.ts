import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookUpdModalComponent } from '../book-upd-modal/book-upd-modal.component';
import { BookService } from '../api/book.service';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';

@Component({
  selector: 'app-shelf',
  imports: [],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.css',
})
export class ShelfComponent implements OnInit, AfterContentInit {
  public listForTest: string[] = [];
  public chunkedList: string[][] = [];
  private columnAmount = 7;

  constructor(public dialog: MatDialog, private bookService: BookService) {}

  ngOnInit(): void {
    this.listForTest = [
      'name1',
      'name2',
      'name3',
      'name4',
      'name5',
      'name6',
      'name7',
      'name8',
      'name9',
      'name10',
      'name11',
    ];

    this.chunkedList = this.chunkArray(this.listForTest, this.columnAmount);
    console.log(this.chunkedList);
  }

  ngAfterContentInit(): void {
    this.bookService.getBooks().subscribe({
      next(value) {
        console.log(value);
      },
    });
  }

  private chunkArray(array: string[], columns: number): any[][] {
    const result = [];

    const fullList = [...array, 'add'];

    for (let i = 0; i < fullList.length; i += columns) {
      result.push(fullList.slice(i, i + columns));
    }

    return result;
  }

  openUpdModal(item: string) {
    console.log(item);
    // this.modal.itemName.set(item);
    this.dialog.open(BookUpdModalComponent, { width: '300px' });
  }

  openAddModal(item: string) {
    console.log(item);
    // this.modal.itemName.set(item);
    this.dialog.open(AddBookModalComponent, { width: '300px' });
  }
}
