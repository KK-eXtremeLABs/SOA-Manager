import { Routes } from '@angular/router';

export const associationsRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/list-associations.component').then(m => m.ListAssociationsComponent) },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  { path: 'details/:id', loadComponent: () => import('./details/detail-association.component').then(m => m.DetailAssociationComponent) },
  { path: 'units/details/:id', loadComponent: () => import('./units/detail/unit-details.component').then(m => m.UnitDetailsComponent) },
];
