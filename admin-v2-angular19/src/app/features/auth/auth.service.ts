import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService } from '../../core/services/profile.service';
import { TokenService } from '../../core/services/token.service';
import { Helpers } from '../../core/utils/helpers';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private tokenService: TokenService
  ) {}

  login(username: string, password: string): Observable<any> {
    const path = environment.baseUrl + 'auth/login';
    return this.http.post(path, { username, password });
  }

  forgotPassword(email: string): Observable<any> {
    const path = environment.baseUrl + 'users/forgot-password';
    return this.http.post(path, { email });
  }

  resetPassword(
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ): Observable<any> {
    const path = environment.baseUrl + 'users/reset-password';
    return this.http.post(path, {
      email,
      token,
      password,
      password_confirmation,
    });
  }

  verifyToken(token: string, email: string): Observable<any> {
    const path = environment.baseUrl + 'users/verify-token';
    return this.http.get(path, { params: { email, token } });
  }

  changePassword(data: any): Observable<any> {
    const path = environment.adminUrl + 'change-password';
    return this.http.post(path, data);
  }

  logout(): Observable<void> {
    const path = environment.baseUrl + 'auth/logout';
    return this.http.get(path).pipe(
      map(() => {
        this.tokenService.removeToken();
      })
    );
  }

  handleError(err: any): string[] {
    if (Helpers.empty(err)) return [];
    const errorMessage: string[] = [];
    Object.keys(err).forEach((key) => {
      errorMessage.push(...[].concat(err[key]));
    });
    return errorMessage;
  }

  canAccess(controles: string[] | string, strict = false): boolean {
    const profile = this.profileService.profile;
    if (!profile) return false;
    if (profile.role.name === 'site_admin') return true;

    const controls = Array.isArray(controles) ? controles : [controles];
    if (strict) {
      return controls.every((item) => profile.permissions.includes(item));
    }
    return controls.some((item) => profile.permissions.includes(item));
  }

  verifyTwoFa(data: any): Observable<any> {
    const path = environment.adminUrl + 'verify-2fa-otp';
    return this.http.post(path, data);
  }

  setupTwoFa(): Observable<any> {
    const path = environment.adminUrl + 'setup-2fa';
    return this.http.get(path);
  }
}
