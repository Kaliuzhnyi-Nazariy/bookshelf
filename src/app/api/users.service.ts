import { inject, Injectable, signal } from '@angular/core';
import { Observable, startWith, tap } from 'rxjs';
import { ICreatedUser, IUpdUser, IUpdUserReturn } from '../dtos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { accessToken as at } from './helper';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userName = signal('');
  userEmail = signal('');

  private baseURL = 'http://localhost:3500/users';

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  checkIfLogged(): Observable<ICreatedUser> | void {
    console.log(document.cookie.includes('accessToken'));
    if (!document.cookie.includes('accessToken')) {
      return;
    }

    const accessToken = at();

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
          this.userName.set(res.name);
          this.userEmail.set(res.email);
          this.authService.setAuthStat(true);
        })
      );
  }

  updateUserData(dto: IUpdUser): Observable<IUpdUserReturn> {
    const accessToken = at();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.put<IUpdUserReturn>(`${this.baseURL}`, dto, { headers });
  }

  deleteUser(): Observable<void> | void {
    const accessToken = at();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .delete<void>(`${this.baseURL}`, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.authService.setAuthStat(false);
          this.authService.clearUserData();
          this.userName.set('');
          this.userEmail.set('');
        })
      );
  }
}
