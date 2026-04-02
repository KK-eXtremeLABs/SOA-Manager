import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { authGuard } from './core/guards/auth.guard';
import { canAccessGuard } from './core/guards/can-access.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // Auth routes (public, no layout)
  ...authRoutes,

  // Authenticated routes with layout shell
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      // Users
      {
        path: 'users',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_users_view' },
        loadComponent: () =>
          import('./features/users/list/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'users/add',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_users_add' },
        loadComponent: () =>
          import('./features/users/add/add-user.component').then(
            (m) => m.AddUserComponent
          ),
      },
      {
        path: 'user/edit/:id',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_users_update' },
        loadComponent: () =>
          import('./features/users/add/add-user.component').then(
            (m) => m.AddUserComponent
          ),
      },
      {
        path: 'user/detail/:id',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_users_detail' },
        loadComponent: () =>
          import('./features/users/detail/user-detail.component').then(
            (m) => m.UserDetailComponent
          ),
      },

      // Notifications
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './features/notifications/list/list-notifications.component'
          ).then((m) => m.ListNotificationsComponent),
      },

      // Accounting (child routes with landing nav)
      {
        path: 'accounting',
        loadChildren: () =>
          import('./features/accounting/accounting.routes').then(
            (m) => m.accountingRoutes
          ),
      },

      // Feature modules (lazy-loaded, placeholders for now)
      {
        path: 'associations',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_associations_view' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'organizations',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_oam_view' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'vendors',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_vendors_view' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'setting',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'error-logs',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_error_logs_view' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'activity-logs',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_activity_logs_view' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'online-payments',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
];
