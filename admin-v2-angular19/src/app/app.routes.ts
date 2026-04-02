import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  // Auth routes (public)
  ...authRoutes,

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
