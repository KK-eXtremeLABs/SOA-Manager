import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { ProfileService } from '../services/profile.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const profileService = inject(ProfileService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        profileService.profile = null;
        tokenService.removeToken();
        router.navigate(['/login']);
      }
      const error = err.error || err;
      return throwError(() => error);
    })
  );
};
