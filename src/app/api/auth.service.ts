import { inject, Injectable } from '@angular/core';
import { ICreatedUser, ISignIn, ISignUp } from '../dtos';
import { BehaviorSubject, Observable, startWith, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = 'https://bookshelf-api-8c76.onrender.com/auth';
  // private baseURL = 'http://localhost:3500/auth';

  private loggedIn = new BehaviorSubject<boolean>(false);

  get authStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setAuthStat(val: boolean) {
    this.loggedIn.next(val);
  }

  private user = new BehaviorSubject<ICreatedUser | null>(null);
  userData = this.user.asObservable();

  setUserData(data: ICreatedUser) {
    this.user.next(data);
  }

  clearUserData() {
    this.user.next({
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
      if (data) {
        this.setAuthStat(true);
      }
      location.reload();

      return data;
    } catch (error) {
      console.error(error);
      this.setAuthStat(false);
    }
  }

  async signIn(dto: ISignIn) {
    try {
      const answer = await fetch(`${this.baseURL}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });
      const data = await answer.json();
      if (data) {
        console.log(data);
        this.setAuthStat(true);
      }

      location.reload();
      return data;
    } catch (error) {
      console.error(error);
      this.setAuthStat(false);
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
      location.reload();
    } catch (error) {
      console.error(error);
      this.setAuthStat(false);
    }
  }

  // logout(): Observable<void> {
  //   const accessToken = at();

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`,
  //   });

  //   return this.http
  //     .delete<void>(`${this.baseURL}/logout`, {
  //       headers,
  //       withCredentials: true,
  //     })
  //     .pipe(
  //       tap(() => {
  //         this.setAuthStat(false);
  //       })
  //     );
  // }
}
