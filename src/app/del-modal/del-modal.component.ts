import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-del-modal',
  imports: [],
  templateUrl: './del-modal.component.html',
  styleUrl: './del-modal.component.css',
})
export class DelModalComponent {
  constructor(public dialog: MatDialogRef<DelModalComponent>) {}

  closeModal() {
    this.dialog.close();
  }
}
