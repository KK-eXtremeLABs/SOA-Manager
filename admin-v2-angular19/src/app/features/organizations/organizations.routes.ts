import { Routes } from '@angular/router';

export const organizationsRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/list-organization.component').then(m => m.ListOrganizationComponent) },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  { path: 'details/:id', loadComponent: () => import('./details/detail-organization.component').then(m => m.DetailOrganizationComponent) },
];
