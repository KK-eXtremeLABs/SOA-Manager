import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-roles-list', standalone: true, imports: [CommonModule, MatCardModule], template: `<mat-card><mat-card-header><mat-card-title>Roles</mat-card-title></mat-card-header><mat-card-content><p>Component ready for implementation</p></mat-card-content></mat-card>` })
export class RolesListComponent {}
