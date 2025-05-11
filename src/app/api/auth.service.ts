import { inject, Injectable, signal } from '@angular/core';
import { ICreatedUser, ISignIn, ISignUp } from '../dtos';
import { BehaviorSubject, Observable, startWith, Subject, tap } from 'rxjs';
import { PopUpService } from '../services/pop-up.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = 'https://bookshelf-api-8c76.onrender.com/auth';
  // private baseURL = 'http://localhost:3500/auth';

  private loggedIn = signal(false);

  private popUpService = inject(PopUpService);

  constructor() {
    const stored = localStorage.getItem('isLoggedIn');
    if (stored !== null) {
      this.loggedIn.set(JSON.parse(stored));
    }
  }

  get authLogStatus(): boolean {
    const stored = localStorage.getItem('isLoggedIn');
    if (stored !== null) {
      return JSON.parse(stored);
    }
    return this.loggedIn();
  }

  authStatus = this.loggedIn;

  setAuthStat(val: boolean) {
    // this.loggedIn.next(val);
    localStorage.setItem('isLoggedIn', JSON.stringify(val));
    this.loggedIn.set(val);
    return;
  }

  private user = signal<ICreatedUser>({
    _id: '',
    accessToken: '',
    email: '',
    password: '',
    name: '',
  });

  userData = this.user();

  setUserData(data: ICreatedUser) {
    // this.user.next(data);
    this.user.set(data);
    return;
  }

  clearUserData() {
    this.user.set({
      _id: '',
      accessToken: '',
      email: '',
      password: '',
      name: '',
    });
  }

  async signUp(dto: ISignUp) {
    try {
      const request = await fetch(`${this.baseURL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data = await request.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        throw new Error(data.error);
      }

      this.setAuthStat(true);

      this.popUpService.setSuccessMessage('Signed up!');

      return data;
    } catch (error) {
      console.error(error);
      this.setAuthStat(false);
    }
  }

  async signIn(dto: ISignIn) {
    try {
      const req = await fetch(`${this.baseURL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data = await req.json();

      if (data.message) {
        this.popUpService.setErrorMessage(data.message);
        this.setAuthStat(false);
        return;
      }

      this.setUserData(data);
      this.setAuthStat(true);

      this.popUpService.setSuccessMessage('Signed in!');

      return data;
    } catch (error: any) {
      console.log(error);
      this.popUpService.setErrorMessage(error.message);
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.setAuthStat(false);
      this.popUpService.setSuccessMessage('Logged out!');
      this.clearUserData();

      return;
    } catch (error: any) {
      // console.error(error);
      this.popUpService.setErrorMessage(error.message);
      this.setAuthStat(false);
      return;
    }
  }
}
