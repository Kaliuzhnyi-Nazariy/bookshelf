import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../api';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sign-up-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sign-up-modal.component.html',
  styleUrl: './sign-up-modal.component.css',
})
export class SignUpModalComponent {
  signupForm: FormGroup;

  isLoading = false;

  emailErrorMessage = signal('');
  nameErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

  errorReqMessage = signal('');

  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialogRef<SignUpModalComponent>,
    private service: AuthService
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
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
        confirmPassword: [
          '',
          [
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
            Validators.required,
          ],
        ],
      },
      { validators: this.matchPasswords.bind(this) }
    );

    // merge(this.email!.statusChanges, this.email!.valueChanges)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(() => this.updateEmailErrorMessage());
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    try {
      this.isLoading = true;
      this.errorReqMessage.set('');
      if (this.signupForm.valid) {
        this.service.signUp(this.signupForm.value).subscribe({
          next: () => {
            this.dialog.close();
          },
          error: (err) => {
            this.isLoading = false;
            this.errorReqMessage.set(err.error.message);
          },
        });
      } else {
        this.isLoading = false;
      }
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  updateEmailErrorMessage() {
    const emailCtrl = this.signupForm.get('email');
    if (!emailCtrl?.touched) return;
    if (emailCtrl?.hasError('required')) {
      this.emailErrorMessage.set('This field is required!');
    } else if (emailCtrl?.hasError('email')) {
      this.emailErrorMessage.set('Enter a valid email!');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updateNameErrorMessage() {
    const nameCtrl = this.signupForm.get('name');
    if (!nameCtrl?.touched) return;
    if (nameCtrl?.hasError('required')) {
      this.nameErrorMessage.set('Name: This field is required!');
    } else if (nameCtrl?.hasError('minlength')) {
      this.nameErrorMessage.set('Name: Should be longer than 3 characters!');
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updatePasswordMessage() {
    const passwordCtrl = this.signupForm.get('password');
    if (!passwordCtrl?.touched) return;
    if (passwordCtrl?.hasError('required')) {
      this.passwordErrorMessage.set('This field is required');
    } else if (passwordCtrl?.hasError('pattern')) {
      this.passwordErrorMessage.set(
        'The password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character from @$!%*?&. It can only contain letters, digits, and those special characters.'
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  updateConfirmPasswordMessage() {
    const confirmPasswordCtrl = this.signupForm.get('confirmPassword');
    if (!confirmPasswordCtrl?.touched) return;
    if (confirmPasswordCtrl?.hasError('required')) {
      this.confirmPasswordErrorMessage.set('This field is required');
    } else if (confirmPasswordCtrl?.hasError('pattern')) {
      this.confirmPasswordErrorMessage.set(
        'The password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character from @$!%*?&. It can only contain letters, digits, and those special characters.'
      );
    }
    if (this.password?.value !== this.confirmPassword?.value) {
      this.confirmPasswordErrorMessage.set('Passwords do not matches!');
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  changeVisability(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
