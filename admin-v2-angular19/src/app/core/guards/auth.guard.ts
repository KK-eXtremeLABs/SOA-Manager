import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // No token = not logged in, skip API call
  if (!tokenService.getToken()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  try {
    const profile: any = await firstValueFrom(
      profileService.getProfile()
    ).catch(() => null);

    if (await profileService.isLoggedIn()) {
      if (profile?.record?.is_2fa_enabled) {
        if (profile.record.google2fa_authentication) {
          return true;
        } else {
          router.navigate(['2FA']);
          return false;
        }
      }
      return true;
    }
  } catch {
    // API error — redirect to login
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
