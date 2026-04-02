import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../services/token.service';
import { ProfileService } from '../services/profile.service';

export const twoFaGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const profileService = inject(ProfileService);

  if (!tokenService.getToken()) {
    router.navigate(['login']);
    return false;
  }

  const profile: any = await firstValueFrom(
    profileService.getProfile()
  ).catch(() => null);

  if (profile?.record?.google2fa_authentication) {
    router.navigate(['dashboard']);
    return false;
  }

  return true;
};
