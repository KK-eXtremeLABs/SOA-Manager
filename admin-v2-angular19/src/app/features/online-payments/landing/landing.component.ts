import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-online-payments-landing', standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  template: `<div style="margin-bottom:16px"><a mat-stroked-button routerLink="list" routerLinkActive="active-btn"><mat-icon>list</mat-icon> Payments List</a></div><router-outlet />`,
  styles: ['.active-btn{background-color:#c4272e!important;color:white!important}'],
})
export class OnlinePaymentsLandingComponent {}
