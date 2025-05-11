import { Component, effect, signal } from '@angular/core';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css',
})
export class PopUpComponent {
  errorMessages = signal<string[]>([]);

  successMessages = signal<string[]>([]);

  constructor(private popUpService: PopUpService) {
    effect(() => {
      this.errorMessages.set(this.popUpService.errorMessages());
      this.successMessages.set(this.popUpService.successMessages());
    });
  }
}
