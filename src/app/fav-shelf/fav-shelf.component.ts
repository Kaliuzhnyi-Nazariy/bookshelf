import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fav-shelf',
  imports: [],
  templateUrl: './fav-shelf.component.html',
  styleUrl: './fav-shelf.component.css',
})
export class FavShelfComponent implements OnInit {
  public listForTest: string[] = [];
  private columnAmount = 7;
  public fillers: any[] = [];

  ngOnInit(): void {
    this.listForTest = [
      // 'name1',
      // 'name2',
      // 'name3',
      // 'name4',
      // 'name5',
      // 'name6',
      // 'name7',
      // 'name8',
      // 'name9',
      // 'name10',
      // 'name11',
      // 'name21',
      // 'name31',
      // 'name41',
      // 'name51',
      // 'name61',
      // 'name71',
      // 'name81',
      // 'name91',
      // 'name101',
      // 'name12',
      // 'name22',
      // 'name32',
      // 'name42',
      // 'name52',
      // 'name62',
      // 'name72',
      // 'name82',
      // 'name92',
      // 'name102',
      // 'name112',
      // 'name212',
      // 'name312',
      // 'name412',
      // 'name512',
      // 'name612',
      // 'name712',
      // 'name812',
      // 'name912',
      // 'name1012',
    ];

    const reminder = this.listForTest.length % this.columnAmount;
    const fillerCount = reminder === 0 ? 0 : this.columnAmount - reminder;
    this.fillers = Array(fillerCount).fill(null);

    // const observable = new Observable(function subscribe(subscriber) {
    //   try {
    //     subscriber.next(1);
    //     subscriber.next(2);
    //     subscriber.next(3);
    //     subscriber.complete();
    //   } catch (err) {
    //     subscriber.error(err); // delivers an error if it caught one
    //   }
    // });

    // observable.subscribe({
    //   next(x) {
    //     console.log('x: ', x);
    //   },
    //   error(err) {
    //     console.error(err);
    //   },
    //   complete() {
    //     console.log('Done!');
    //   },
    // });
  }
}
