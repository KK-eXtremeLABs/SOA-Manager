import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-inspection-items',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `<mat-card><mat-card-header><mat-card-title>Inspection Items</mat-card-title></mat-card-header><mat-card-content><p style="padding:24px 0;text-align:center;color:#666">Settings management interface</p></mat-card-content></mat-card>`,
})
export class InspectionItemsComponent {}
