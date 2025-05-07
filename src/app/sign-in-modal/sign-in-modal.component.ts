import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../api';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sign-in-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.css',
})
export class SignInModalComponent {
  signinForm: FormGroup;
  isLoading: boolean = false;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  errorReqMessage = signal('');

  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<SignInModalComponent>,
    private authService: AuthService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
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

  async onSubmit() {
    try {
      this.isLoading = true;
      this.errorReqMessage.set('');

      if (this.signinForm.valid) {
        await this.authService.signIn(this.signinForm.value);
        this.isLoading = false;
        this.dialog.close();

        // this.authService.signIn(this.signinForm.value).subscribe({
        //   next: () => {
        // this.dialog.close();
        //   },
        //   error: (err) => {
        //     this.isLoading = false;
        //     this.errorReqMessage.set(err.error.message);
        //   },
        // });
      } else {
        this.isLoading = false;
      }
    } catch (error) {
      this.isLoading = false;
    }
  }

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  updateEmailMessage() {
    const emailCtrl = this.signinForm.get('email');
    if (!emailCtrl || !emailCtrl.touched) return;
    if (emailCtrl.hasError('required')) {
      this.emailErrorMessage.set('This field is required!');
    } else if (emailCtrl.hasError('email')) {
      this.emailErrorMessage.set('Enter a valid email!');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordMessage() {
    const passwordCtrl = this.signinForm.get('password');
    if (!passwordCtrl || !passwordCtrl.touched) return;
    if (passwordCtrl.hasError('required')) {
      this.passwordErrorMessage.set('This field is required');
    } else if (passwordCtrl.hasError('pattern')) {
      this.passwordErrorMessage.set(
        'The password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character from @$!%*?&. It can only contain letters, digits, and those special characters.'
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  changeVisability(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
