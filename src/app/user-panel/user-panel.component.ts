import {
  AfterViewInit,
  Component,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { AuthService, UsersService } from '../api';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { DelModalComponent } from '../del-modal/del-modal.component';
import { UpdModalComponent } from '../upd-modal/upd-modal.component';
import { BookService } from '../api/book.service';

@Component({
  selector: 'app-user-panel',
  imports: [SignUpModalComponent, SignInModalComponent, DelModalComponent],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css',
})
export class UserPanelComponent implements AfterViewInit, OnInit {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UsersService,
    private bookService: BookService
  ) {
    effect(() => {
      this.isLoggedIn.set(this.authService.authStatus());

      if (this.isLoggedIn()) {
        this.getInfo();
      }

      this.allAmountOfBooks = this.bookService.allBooksAmount();
    });
  }

  async getInfo() {
    try {
      this.isLoading.set(true);
      const data: { name: string; email: string } =
        await this.userService.getUserData();
      this.userName = data.name || '';
      this.userEmail = data.email || '';
    } catch (err: any) {
      console.log(err);
      this.isLoggedIn.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  isLoggedIn = signal(false);
  userName: string = '';
  userEmail: string = '';
  isLoading = signal(false);

  allAmountOfBooks: number | null = null;

  errReqMessage = signal('');

  ngOnInit(): void {
    // this.isLoggedIn = this.authService.authStatus;
    if (this.isLoggedIn()) {
      this.getInfo();
    }

    this.allAmountOfBooks = this.bookService.allBooksAmount();
  }

  ngAfterViewInit(): void {
    // this.isLoggedIn = this.authService.authStatus;
    if (this.isLoggedIn()) {
      this.getInfo();
    }

    this.allAmountOfBooks = this.bookService.allBooksAmount();
  }

  openSignUpModal(): void {
    this.dialog.open(SignUpModalComponent, {
      width: '300px',
      minHeight: '410px',
    });
  }

  openSignInModal(): void {
    this.dialog.open(SignInModalComponent, {
      width: '300px',
      minHeight: '250px',
    });
  }

  openUpdModal(): void {
    this.dialog.open(UpdModalComponent, {
      width: '300px',
    });
  }
  openDelModal(): void {
    this.dialog.open(DelModalComponent, {
      width: '300px',
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
