import { Component, Inject, Input, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../api/book.service';
import { AddBook, Book } from '../dtos';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-upd-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './book-upd-modal.component.html',
  styleUrl: './book-upd-modal.component.css',
})
export class BookUpdModalComponent {
  updBookForm: FormGroup;

  titleOfBook = signal('');
  authorOfBook = signal('');
  DOROfBook = signal('');
  imageURL = signal('');

  titleErrMessage = signal('');
  authorErrMessage = signal('');
  DAOErrMessage = signal('');
  imageErrMessage = signal('');

  reqErrMessage = signal('');

  imageName = signal('');

  isLoading = signal(false);

  imagePreview = signal<string | ArrayBuffer | null>(null);

  constructor(
    public dialog: MatDialogRef<BookUpdModalComponent>,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: Book,
    private fb: FormBuilder
  ) {
    this.titleOfBook.set(this.data.title);
    this.authorOfBook.set(this.data.author);
    this.DOROfBook.set(this.data.descripionAndOpinion);
    this.imageURL.set(this.data.imageUrl);
    this.imagePreview.set(this.data.imageUrl);

    this.updBookForm = this.fb.group({
      title: [this.data.title || '', [Validators.required]],
      author: [this.data.author || '', Validators.required],
      descripionAndOpinion: [
        this.data.descripionAndOpinion || '',
        [Validators.maxLength(256)],
      ],
      image: [this.data.imageUrl || null, this.imageValidator()],
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

    if (!file) return;

    if (file && file?.size > maxsize) {
      this.imageErrMessage.set('photo should be less than 1mb');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(reader.result);
    };

    reader.readAsDataURL(file);

    this.imageName.set(file.name);
    this.updBookForm.patchValue({ image: file });
    this.updBookForm.get('image')?.updateValueAndValidity();
  }

  async deleteBook() {
    this.isLoading.set(true);
    await this.bookService.deleteBook(this.data._id);
    this.isLoading.set(false);
    this.dialog.close();
  }

  async onSubmit() {
    this.isLoading.set(true);
    this.reqErrMessage.set('');

    try {
      if (this.updBookForm.valid) {
        const formData = new FormData();

        formData.append('title', this.updBookForm.value.title);
        formData.append('author', this.updBookForm.value.author);
        formData.append(
          'descripionAndOpinion',
          this.updBookForm.value.descripionAndOpinion || ''
        );
        if (this.updBookForm.value.image) {
          formData.append('file', this.updBookForm.value.image);
        }
        await this.bookService.updateBook(formData, this.data._id);
        this.isLoading.set(false);
        this.dialog.close();
      }
    } catch (error) {
      this.isLoading.set(false);
      this.reqErrMessage.set('Something went wrong!');
    }
  }

  get title() {
    return this.updBookForm.get('title');
  }

  get author() {
    return this.updBookForm.get('author');
  }

  get dao() {
    return this.updBookForm.get('descripionAndOpinion');
  }

  get img() {
    return this.updBookForm.get('imageUrl');
  }

  get imgbgc() {
    return { 'background-image': `url(${this.imageURL})` };
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
    if (!authorCtrl || !authorCtrl.touched) return;
    if (authorCtrl.hasError('required')) {
      this.authorErrMessage.set('This field is required!');
    } else {
      this.authorErrMessage.set('');
    }
  }

  updateDAOErrMessage() {
    const DAOCtrl = this.dao;
    if (!DAOCtrl || !DAOCtrl.touched) return;
    if (DAOCtrl.hasError('maxlength')) {
      this.DAOErrMessage.set('Maximum 256 characters!');
    } else {
      this.DAOErrMessage.set('This field is required!');
    }
  }
}
