import { Routes } from '@angular/router';
import { canAccessGuard } from '../../core/guards/can-access.guard';

export const onlinePaymentsRoutes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing.component').then(m => m.OnlinePaymentsLandingComponent), children: [
    { path: 'list', loadComponent: () => import('./listing/listing.component').then(m => m.OnlinePaymentsListingComponent), canActivate: [canAccessGuard], data: { controle: 'admin_online_payment_view' } },
  ]},
];
