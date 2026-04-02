import { Routes } from '@angular/router';

export const vendorsRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/list-vendors.component').then(m => m.ListVendorsComponent) },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  { path: 'details/:id', loadComponent: () => import('./details/detail-vendor.component').then(m => m.DetailVendorComponent) },
];
