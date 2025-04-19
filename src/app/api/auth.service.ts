import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICreatedUser, ISignIn, ISignUp } from '../dtos';
import { BehaviorSubject, Observable, startWith, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseURL = 'https://bookshelf-api-8c76.onrender.com/auth';
  private baseURL = 'http://localhost:3500/auth';

  private http = inject(HttpClient);

  private loggedIn = new BehaviorSubject<boolean>(false);

  get authStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setAuthStat(val: boolean) {
    this.loggedIn.next(val);
  }
  private user = new Subject<ICreatedUser>();

  get userData(): Observable<ICreatedUser> {
    return this.user.asObservable();
  }

  setUserData(userData: ICreatedUser) {
    this.user.next(userData);
  }

  signUp(dto: ISignUp): Observable<ICreatedUser> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<ICreatedUser>(`${this.baseURL}/signup`, dto, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.setAuthStat(true);
          this.setUserData(response);
        })
      );
  }

  signIn(dto: ISignIn): Observable<ICreatedUser> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<ICreatedUser>(`${this.baseURL}/signin`, dto, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.setAuthStat(true);
          this.setUserData(res);
        })
      );
  }

  checkIfLogged(): Observable<ICreatedUser> | void {
    console.log(document.cookie.includes('accessToken'));
    if (!document.cookie.includes('accessToken')) {
      return;
    }

    const accessToken = document.cookie
      .split('; ')
      .find((row) => row, startWith('accessToken='))
      ?.split('=')[1];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .get<ICreatedUser>(`http://localhost:3500/users/me`, {
        headers,
      })
      .pipe(
        tap((res) => {
          this.setUserData(res);
          this.setAuthStat(true);
        })
      );
  }
}
