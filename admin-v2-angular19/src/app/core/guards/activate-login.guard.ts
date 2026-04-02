import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const activateLoginGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  if (tokenService.getToken()) {
    router.navigate([route.queryParams['returnUrl'] || '/organizations']);
    return false;
  }

  return true;
};
