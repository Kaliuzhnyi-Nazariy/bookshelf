import { inject, Injectable, signal } from '@angular/core';
import { ICreatedUser, IUpdUser, IUpdUserReturn } from '../dtos';
import { AuthService } from './auth.service';
import { PopUpService } from '../services/pop-up.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userName = signal('');
  userEmail = signal('');

  private baseURL = 'https://bookshelf-api-8c76.onrender.com/users';
  // private baseURL = 'http://localhost:3500/users';

  private authService = inject(AuthService);
  private popUpService = inject(PopUpService);

  checkIfLogged() {
    console.log(Boolean(localStorage.getItem('isLoggedIn')));
    if (Boolean(localStorage.getItem('isLoggedIn'))) {
      return Boolean(localStorage.getItem('isLoggedIn'));
    } else {
      return this.authService.setAuthStat(false);
    }
  }

  async getUserData() {
    try {
      const req = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await req.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);

        throw new Error(data.message);
      }

      this.userName.set(data.name);
      this.userEmail.set(data.email);

      return data;
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);
      this.authService.setAuthStat(false);
      return;
    }
  }

  async updateUserData(dto: IUpdUser) {
    try {
      const request = await fetch(`${this.baseURL}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data = await request.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
      }

      this.popUpService.setSuccessMessage('User updated! Please sign in!');

      return data;
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);
      return;
    }
  }

  async deleteUser() {
    try {
      const request = await fetch(`${this.baseURL}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await request.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
      }

      this.authService.setAuthStat(false);
      this.authService.clearUserData();
      this.userName.set('');
      this.userEmail.set('');

      this.popUpService.setSuccessMessage('Account deleted!');
    } catch (error: any) {
      this.popUpService.setErrorMessage(error.message);
      return;
    }
  }
}
