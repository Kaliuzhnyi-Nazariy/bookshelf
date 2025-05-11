import { Injectable, signal } from '@angular/core';
import { IPopUp } from './pop-up.dto';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  errorMessages = signal<string[]>([]);
  successMessages = signal<string[]>([]);

  setErrorMessage(message: string) {
    this.errorMessages.update((msgs) => [...msgs, message]);

    setTimeout(() => {
      if (this.errorMessages() && this.errorMessages().length > 0) {
        this.errorMessages.update((msgs) => msgs.slice(1));
      }
    }, 3000);
  }

  setSuccessMessage(message: string) {
    this.successMessages.update((msgs) => [...msgs, message]);

    setTimeout(() => {
      if (this.successMessages() && this.successMessages().length > 0) {
        this.successMessages.update((msgs) => msgs.slice(1));
      }
    }, 3000);
  }
}
