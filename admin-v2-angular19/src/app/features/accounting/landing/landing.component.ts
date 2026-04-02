import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CanAccessPipe } from '../../../shared/pipes/can-access.pipe';

@Component({
  selector: 'app-accounting-landing',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, CanAccessPipe],
  template: `
    <div class="accounting-nav">
      @if ('admin_view_ledger' | canAccess) {
        <a mat-stroked-button routerLink="ledger" routerLinkActive="active-btn"><mat-icon>menu_book</mat-icon> Ledger</a>
      }
      @if ('admin_view_bills' | canAccess) {
        <a mat-stroked-button routerLink="billing/list" routerLinkActive="active-btn"><mat-icon>receipt</mat-icon> Billing</a>
      }
      @if ('admin_view_payments' | canAccess) {
        <a mat-stroked-button routerLink="payments" routerLinkActive="active-btn"><mat-icon>payment</mat-icon> Payments</a>
      }
      @if ('admin_view_pricing' | canAccess) {
        <a mat-stroked-button routerLink="pricing/list" routerLinkActive="active-btn"><mat-icon>sell</mat-icon> Pricing</a>
      }
      @if ('admin_view_addon' | canAccess) {
        <a mat-stroked-button routerLink="addons/list" routerLinkActive="active-btn"><mat-icon>extension</mat-icon> Add-ons</a>
      }
      @if ('admin_view_banking' | canAccess) {
        <a mat-stroked-button routerLink="banking/list" routerLinkActive="active-btn"><mat-icon>account_balance</mat-icon> Banking</a>
        <a mat-stroked-button routerLink="reports" routerLinkActive="active-btn"><mat-icon>assessment</mat-icon> Reports</a>
        <a mat-stroked-button routerLink="banking/balances" routerLinkActive="active-btn"><mat-icon>account_balance_wallet</mat-icon> Balances</a>
      }
    </div>
    <router-outlet />
  `,
  styles: [`
    .accounting-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
    .active-btn { background-color: #c4272e !important; color: white !important; }
  `],
})
export class LandingComponent {}
