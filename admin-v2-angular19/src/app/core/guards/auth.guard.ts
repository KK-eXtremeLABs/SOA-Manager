import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

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

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
