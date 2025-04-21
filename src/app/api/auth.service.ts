import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICreatedUser, ISignIn, ISignUp } from '../dtos';
import { BehaviorSubject, Observable, startWith, Subject, tap } from 'rxjs';
import { accessToken as at } from './helper';

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

  clearUserData() {
    this.user.next({
      _id: '',
      accessToken: '',
      email: '',
      password: '',
      name: '',
    });
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

  logout(): Observable<void> {
    const accessToken = at();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .delete<void>(`${this.baseURL}/logout`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.setAuthStat(false);
        })
      );
  }
}
