import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  { path: '', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'edit', loadComponent: () => import('./edit/edit-profile.component').then(m => m.EditProfileComponent) },
  { path: 'change-password', loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent) },
];
