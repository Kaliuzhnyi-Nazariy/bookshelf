import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { AuthService } from '../api';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-user-panel',
  imports: [SignUpModalComponent, SignInModalComponent],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css',
})
export class UserPanelComponent implements AfterViewInit, OnInit {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  isLoggedIn = false;
  userName: string = '';
  userEmail: string = '';

  ngOnInit(): void {
    this.authService.checkIfLogged()?.subscribe();
    console.log(this.userName);
  }

  ngAfterViewInit(): void {
    this.authService.authStatus.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.authService.userData.subscribe((data) => {
      console.log(data.name);
      this.userName = data.name;
      this.userEmail = data.email;
    });
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
}
