import { inject, Injectable, signal } from '@angular/core';
import { ICreatedUser, IUpdUser, IUpdUserReturn } from '../dtos';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userName = signal('');
  userEmail = signal('');

  private baseURL = 'https://bookshelf-api-8c76.onrender.com/users';
  // private baseURL = 'http://localhost:3500/users';

  private authService = inject(AuthService);

  async checkIfLogged() {
    try {
      const request = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!request) return this.authService.setAuthStat(false);

      const data = await request.json();

      if (data?.message) return this.authService.setAuthStat(false);

      this.authService.setUserData(data);
      this.userName.set(data.name);
      this.userEmail.set(data.email);
      return this.authService.setAuthStat(true);
    } catch (error) {
      console.log({ error });
      return this.authService.setAuthStat(false);
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
      return data;
    } catch (error) {
      console.error(error);
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

      if (data.message) return;
      this.authService.setAuthStat(false);
      this.authService.clearUserData();
      this.userName.set('');
      this.userEmail.set('');
    } catch (error) {
      console.error(error);
    }
  }
}
