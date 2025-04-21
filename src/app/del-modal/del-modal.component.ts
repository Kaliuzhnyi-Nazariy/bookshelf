import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../api';

@Component({
  selector: 'app-del-modal',
  imports: [],
  templateUrl: './del-modal.component.html',
  styleUrl: './del-modal.component.css',
})
export class DelModalComponent {
  isLoading = signal(false);
  reqErrMessage = signal('');

  constructor(
    public dialog: MatDialogRef<DelModalComponent>,
    private userService: UsersService
  ) {}

  closeModal() {
    this.dialog.close();
  }

  deleteUser(): void {
    this.isLoading.set(true);
    try {
      this.userService.deleteUser()?.subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialog.close(); // Close the modal on success
        },
        error: (err) => {
          this.isLoading.set(false);
          this.reqErrMessage.set(err.error.message);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
