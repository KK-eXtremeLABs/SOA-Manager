import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../features/auth/auth.service';

export const canAccessGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  const result = auth.canAccess(
    route.data['controle'],
    route.data['strict'] || false
  );

  if (!result) {
    snackBar.open('You have no permission to access this page', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    router.navigate(['/dashboard']);
  }

  return result;
};
