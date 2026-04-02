import { Routes } from '@angular/router';
import { canAccessGuard } from '../../core/guards/can-access.guard';

export const accountingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
    children: [
      {
        path: 'ledger',
        loadComponent: () =>
          import('./ledger/general-ledger/general-ledger.component').then(
            (m) => m.GeneralLedgerComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_ledger' },
      },
      {
        path: 'billing/list',
        loadComponent: () =>
          import('./billing/list/billing-list.component').then(
            (m) => m.BillingListComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_bills' },
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./payments/list/payments-list.component').then(
            (m) => m.PaymentsListComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_payments' },
      },
      {
        path: 'pricing/list',
        loadComponent: () =>
          import('./pricing/list/pricing-list.component').then(
            (m) => m.PricingListComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_pricing' },
      },
      {
        path: 'addons/list',
        loadComponent: () =>
          import('./addons/list/addons-list.component').then(
            (m) => m.AddonsListComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_addon' },
      },
      {
        path: 'banking/list',
        loadComponent: () =>
          import('./banking/banking.component').then(
            (m) => m.BankingComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_banking' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_banking' },
      },
      {
        path: 'banking/balances',
        loadComponent: () =>
          import('./balances/balances.component').then(
            (m) => m.BalancesComponent
          ),
        canActivate: [canAccessGuard],
        data: { controle: 'admin_view_banking' },
      },
    ],
  },
];
