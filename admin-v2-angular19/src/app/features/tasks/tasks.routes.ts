import { Routes } from '@angular/router';
import { canAccessGuard } from '../../core/guards/can-access.guard';

export const tasksRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/list-tasks.component').then(m => m.ListTasksComponent), canActivate: [canAccessGuard], data: { controle: 'admin_tasks_view_other' } },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  { path: 'add', loadComponent: () => import('./add/add-task.component').then(m => m.AddTaskComponent), canActivate: [canAccessGuard], data: { controle: ['admin_tasks_add', 'admin_tasks_add_other'] } },
  { path: 'edit/:id', loadComponent: () => import('./add/add-task.component').then(m => m.AddTaskComponent), canActivate: [canAccessGuard], data: { controle: ['admin_tasks_update', 'admin_tasks_update_other'] } },
  { path: 'detail/:id', loadComponent: () => import('./detail/detail-task.component').then(m => m.DetailTaskComponent) },
];
