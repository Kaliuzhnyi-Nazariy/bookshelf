import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shelf',
  imports: [],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.css',
})
export class ShelfComponent implements OnInit {
  public listForTest: string[] = [];
  private columnAmount = 7;
  public fillers: any[] = [];

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
      'name21',
      'name31',
      'name41',
      'name51',
      'name61',
      'name71',
      'name81',
      'name91',
      'name101',
    ];

    const reminder = this.listForTest.length % this.columnAmount;
    const fillerCount = reminder === 0 ? 0 : this.columnAmount - reminder;
    this.fillers = Array(fillerCount).fill(null);
  }
}
