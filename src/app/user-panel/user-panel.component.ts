import { Component } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  imports: [],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css',
})
export class UserPanelComponent {
  public name: string = 'Vasya';
  public email: string = 'vasya@mail.com';
  public allAmountOfBooks: number = 17;
}
