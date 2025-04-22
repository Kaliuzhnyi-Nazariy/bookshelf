import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../api/book.service';
import { switchMap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-book-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-book-modal.component.html',
  styleUrl: './add-book-modal.component.css',
})
export class AddBookModalComponent {
  addBook: FormGroup;

  isLoading = signal(false);

  titleErrMessage = signal('');
  authorErrMessage = signal('');
  DAOErrMessage = signal('');
  imageErrMessage = signal('');

  reqErrMessage = signal('');

  imageName = signal('');

  constructor(
    private dialog: MatDialogRef<AddBookModalComponent>,
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.addBook = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      descripionAndOpinion: ['', [Validators.maxLength(256)]],
      image: [null, [this.imageValidator()]],
    });
  }

  imageValidator(
    maxSizeMB: number = 1,
    allowedTypes: Array<string> = ['image/png', 'image/jpeg']
  ) {
    return (control: AbstractControl) => {
      const file = control.value;

      if (!file) return null;

      if (!(file instanceof File)) return { invalidFile: true };

      const isTypeValid = allowedTypes.includes(file.type);
      const isSizeValid = file.size >= maxSizeMB * 1024 * 1024;

      if (!isTypeValid) {
        this.imageErrMessage.set('File can be only png or jpg');
        return { invalidType: true };
      }

      if (isSizeValid) {
        this.imageErrMessage.set('File can be less than 1MB');
        return { maxSizeExceeded: true };
      }

      return null;
    };
  }

  uploadPhoto(event: Event) {
    this.imageErrMessage.set('');

    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    const maxsize = 1 * 1024 * 1024;
    console.log(file);

    if (!file) return;

    console.log(87958 > 1024 * 1024);

    if (file && file?.size > maxsize) {
      this.imageErrMessage.set('photo should be less than 1mb');
      return;
    }

    this.imageName.set(file.name);
    this.addBook.patchValue({ image: file });
    this.addBook.get('image')?.updateValueAndValidity();
  }

  onClose() {
    this.dialog.close();
  }

  onSubmit(): void {
    this.isLoading.set(true);
    this.reqErrMessage.set('');

    try {
      if (this.addBook.valid) {
        this.bookService
          .postBook(this.addBook.value)
          ?.pipe(switchMap(() => this.bookService.getBooks()))
          .subscribe({
            next: (books) => {
              console.log(books);
              this.isLoading.set(false);
              this.dialog.close();
            },
            error: (err) => {
              this.isLoading.set(false);
              this.reqErrMessage.set(err.error.message);
            },
          });
      } else {
        this.isLoading.set(false);
        this.reqErrMessage.set('Something went wrong!');
      }
    } catch (err: any) {
      this.isLoading.set(false);
      this.reqErrMessage.set(err.error.message);
    }
  }

  get title() {
    return this.addBook.get('title');
  }

  get author() {
    return this.addBook.get('author');
  }

  get descripionAndOpinion() {
    return this.addBook.get('descripionAndOpinion');
  }

  get imageUrl() {
    return this.addBook.get('imageUrl');
  }

  updateTitleErrMessage() {
    const titleCtrl = this.title;
    if (!titleCtrl || !titleCtrl?.touched) return;
    if (titleCtrl.hasError('required')) {
      this.titleErrMessage.set('This field is required!');
    } else {
      this.titleErrMessage.set('');
    }
  }

  updateAuthorErrMessage() {
    const authorCtrl = this.author;
    if (!authorCtrl || !authorCtrl?.touched) return;
    if (authorCtrl.hasError('required')) {
      this.authorErrMessage.set('This field is required!');
    } else {
      this.authorErrMessage.set('');
    }
  }

  updateDAOErrMessage() {
    const descCtrl = this.descripionAndOpinion;
    if (!descCtrl || !descCtrl?.touched) return;
    if (descCtrl.hasError('maxlength')) {
      this.DAOErrMessage.set('Maximum 256 characters!');
    } else {
      this.DAOErrMessage.set('');
    }
  }
}
