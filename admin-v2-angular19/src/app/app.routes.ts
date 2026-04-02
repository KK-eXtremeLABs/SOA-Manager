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

      // Associations
      {
        path: 'associations',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_associations_view' },
        loadChildren: () => import('./features/associations/associations.routes').then(m => m.associationsRoutes),
      },
      // Organizations
      {
        path: 'organizations',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_oam_view' },
        loadChildren: () => import('./features/organizations/organizations.routes').then(m => m.organizationsRoutes),
      },
      // Vendors
      {
        path: 'vendors',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_vendors_view' },
        loadChildren: () => import('./features/vendors/vendors.routes').then(m => m.vendorsRoutes),
      },
      // Roles
      {
        path: 'roles',
        loadChildren: () => import('./features/roles/roles.routes').then(m => m.rolesRoutes),
      },
      // Settings
      {
        path: 'setting',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes),
      },
      // Tasks
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes),
      },
      // Error Logs
      {
        path: 'error-logs',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_error_logs_view' },
        loadChildren: () => import('./features/error-logs/error-logs.routes').then(m => m.errorLogsRoutes),
      },
      // Activity Logs
      {
        path: 'activity-logs',
        canActivate: [canAccessGuard],
        data: { controle: 'admin_activity_logs_view' },
        loadChildren: () => import('./features/activity-logs/activity-logs.routes').then(m => m.activityLogsRoutes),
      },
      // Online Payments
      {
        path: 'online-payments',
        loadChildren: () => import('./features/online-payments/online-payments.routes').then(m => m.onlinePaymentsRoutes),
      },
      // Profile
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes),
      },
      {
        path: 'profile/view',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
];
