import { Routes } from '@angular/router';

export const activityLogsRoutes: Routes = [
  { path: '', loadComponent: () => import('./list/activity-logs-list.component').then(m => m.ActivityLogsListComponent) },
];
