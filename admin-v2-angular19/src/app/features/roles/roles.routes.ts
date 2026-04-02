import { Routes } from '@angular/router';
import { canAccessGuard } from '../../core/guards/can-access.guard';

export const rolesRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/roles-list.component').then(m => m.RolesListComponent), canActivate: [canAccessGuard], data: { controle: 'admin_roles_view' } },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  { path: 'add', loadComponent: () => import('./add/add-role.component').then(m => m.AddRoleComponent), canActivate: [canAccessGuard], data: { controle: 'admin_roles_add' } },
  { path: 'edit/:id', loadComponent: () => import('./add/add-role.component').then(m => m.AddRoleComponent), canActivate: [canAccessGuard], data: { controle: 'admin_roles_update' } },
];
