import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, UsersService } from '../api';

@Component({
  selector: 'app-upd-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './upd-modal.component.html',
  styleUrl: './upd-modal.component.css',
})
export class UpdModalComponent {
  updForm: FormGroup;

  isLoading = signal(false);

  hide = signal(true);

  errReqMessage = signal('');

  nameErrorMessage = signal('');
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialogRef<UpdModalComponent>,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    this.updForm = this.fb.group({
      name: [
        this.usersService.userName(),
        [Validators.required, Validators.minLength(3)],
      ],
      email: [
        this.usersService.userEmail(),
        [Validators.email, Validators.required],
      ],
      password: [
        '',
        [
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
          Validators.required,
        ],
      ],
    });
  }

  onSubmit() {
    try {
      this.isLoading.set(true);
      this.errReqMessage.set('');
      if (this.updForm.valid) {
        this.usersService.updateUserData(this.updForm.value).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.authService.setAuthStat(false);
            this.dialog.close();
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errReqMessage.set(err.error.message);
            //need to sign new token and add it on Backend
          },
        });
      } else {
        this.isLoading.set(false);
      }
    } catch (error) {
      this.errReqMessage.set('');
    }
  }

  changeVisability(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateNameErrorMessage() {}
  updateEmailErrorMessage() {}
  updatePasswordErrorMessage() {}

  get name() {
    return this.updForm.get('name');
  }

  get email() {
    return this.updForm.get('email');
  }

  get password() {
    return this.updForm.get('password');
  }
}
