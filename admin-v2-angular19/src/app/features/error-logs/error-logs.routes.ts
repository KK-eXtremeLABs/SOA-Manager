import { Routes } from '@angular/router';

export const errorLogsRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/error-logs-list.component').then(m => m.ErrorLogsListComponent) },
];
