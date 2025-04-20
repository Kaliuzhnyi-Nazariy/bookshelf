import { inject, Injectable } from '@angular/core';
import { Observable, startWith, tap } from 'rxjs';
import { ICreatedUser, IUpdUser, IUpdUserReturn } from '../dtos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getAccessToken(): string | undefined {
    return document.cookie
      .split('; ')
      .find((row) => row, startWith('accessToken='))
      ?.split('=')[1];
  }

  private baseURL = 'http://localhost:3500/users';

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  checkIfLogged(): Observable<ICreatedUser> | void {
    console.log(document.cookie.includes('accessToken'));
    if (!document.cookie.includes('accessToken')) {
      return;
    }

    const accessToken = this.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .get<ICreatedUser>(`${this.baseURL}/me`, {
        headers,
      })
      .pipe(
        tap((res) => {
          this.authService.setUserData(res);
          this.authService.setAuthStat(true);
        })
      );
  }

  updateUserData(dto: IUpdUser): Observable<IUpdUserReturn> {
    const accessToken = this.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put<IUpdUserReturn>(`${this.baseURL}`, dto, { headers });
  }
}
