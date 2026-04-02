import { Routes } from '@angular/router';
import { activateLoginGuard } from '../../core/guards/activate-login.guard';
import { twoFaGuard } from '../../core/guards/two-fa.guard';

export const authRoutes: Routes = [
  {
    path: 'auth/login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [activateLoginGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
    canActivate: [activateLoginGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    canActivate: [activateLoginGuard],
  },
  {
    path: '2FA',
    loadComponent: () =>
      import('./google-authenticator/google-authenticator.component').then(
        (m) => m.GoogleAuthenticatorComponent
      ),
    canActivate: [twoFaGuard],
  },
];
