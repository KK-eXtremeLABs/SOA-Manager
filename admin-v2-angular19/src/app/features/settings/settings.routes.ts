import { Routes } from '@angular/router';
import { canAccessGuard } from '../../core/guards/can-access.guard';

export const settingsRoutes: Routes = [
  { path: '', loadComponent: () => import('./system-settings/system-settings.component').then(m => m.SystemSettingsComponent) },
  { path: 'job-settings', loadComponent: () => import('./configure/configure.component').then(m => m.ConfigureComponent), canActivate: [canAccessGuard], data: { controle: 'admin_settings_system' } },
  { path: 'job-category/list', loadComponent: () => import('./job-categories/list/list-job-categories.component').then(m => m.ListJobCategoriesComponent), canActivate: [canAccessGuard], data: { controle: 'admin_settings_system' } },
  { path: 'payment-gateways', loadComponent: () => import('./gateways/list/list-payment-gateway.component').then(m => m.ListPaymentGatewayComponent), canActivate: [canAccessGuard], data: { controle: 'admin_settings_system' } },
  { path: 'inspection-items', loadComponent: () => import('./inspection-items/inspection-items.component').then(m => m.InspectionItemsComponent), canActivate: [canAccessGuard], data: { controle: 'admin_settings_system' } },
  { path: 'call-gateways', loadComponent: () => import('./call-gateways/list/call-gateways-list.component').then(m => m.CallGatewaysListComponent), canActivate: [canAccessGuard], data: { controle: 'admin_settings_system' } },
];
