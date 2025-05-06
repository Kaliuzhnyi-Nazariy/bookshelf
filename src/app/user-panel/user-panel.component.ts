import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { AuthService, UsersService } from '../api';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';
import { DelModalComponent } from '../del-modal/del-modal.component';
import { UpdModalComponent } from '../upd-modal/upd-modal.component';

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
    private userService: UsersService
  ) {}

  isLoggedIn = false;
  userName: string = '';
  userEmail: string = '';

  errReqMessage = signal('');

  ngOnInit(): void {
    this.userService.checkIfLogged();

    this.authService.authStatus.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.authService.userData.subscribe({
          next: (val) => {
            if (val) {
              this.userName = val.name;
              this.userEmail = val.email;
            }
          },
        });
      }
    });

    // this.isLoggedIn = this.authService.authStatus;
    // this.authService.userData.subscribe({
    //   next: (val) => {
    //     if (val) {
    //       this.userName = val.name;
    //       this.userEmail = val.email;
    //     }
    //   },
    // });
  }

  ngAfterViewInit(): void {
    this.authService.authStatus.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.authService.userData.subscribe({
          next: (val) => {
            if (val) {
              console.log({ status }, val);
              this.userName = val.name;
              this.userEmail = val.email;
            }
          },
        });
      }
    });
    // this.isLoggedIn = this.authService.authStatus;
    // console.log('this.authService.authStatus: ', this.authService.authStatus);
    // if (this.isLoggedIn) {
    //   this.authService.userData.subscribe({
    //     next: (val) => {
    //       if (val) {
    //         this.userName = val.name;
    //         this.userEmail = val.email;
    //       }
    //     },
    //   });
    // }
  }

  public allAmountOfBooks: number = 17;

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
      width: '350px',
    });
  }
  openDelModal(): void {
    this.dialog.open(DelModalComponent, {
      width: '350px',
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
