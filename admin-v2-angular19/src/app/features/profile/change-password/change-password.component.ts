import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <section class="sub-header"><div class="header-row"><h3>Change Password</h3><a mat-stroked-button routerLink="/profile"><mat-icon>chevron_left</mat-icon> Back</a></div></section>
    <mat-card class="form-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width"><mat-label>Current Password</mat-label><input matInput type="password" formControlName="current_password" /></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>New Password</mat-label><input matInput type="password" formControlName="password" /></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Confirm Password</mat-label><input matInput type="password" formControlName="password_confirmation" /></mat-form-field>
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || spinner">
              @if (spinner) { <mat-spinner diameter="20"></mat-spinner> } @else { <mat-icon>save</mat-icon> }
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.sub-header { padding: 0 0 16px; } .header-row { display: flex; justify-content: space-between; align-items: center; } .header-row h3 { margin: 0; color: #c4272e; } .form-card { max-width: 500px; } .full-width { width: 100%; } .form-actions { text-align: right; button { display: inline-flex; align-items: center; gap: 8px; } }`],
})
export class ChangePasswordComponent {
  form: FormGroup; spinner = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({ current_password: ['', Validators.required], password: ['', [Validators.required, Validators.minLength(6)]], password_confirmation: ['', Validators.required] });
  }
  submit(): void {
    if (this.form.invalid) return;
    this.spinner = true;
    this.auth.changePassword(this.form.value).subscribe({
      next: (resp: any) => { if (resp.status === 'success') { this.snackBar.open('Password updated', 'Close', { duration: 3000, panelClass: ['success-snackbar'] }); this.router.navigate(['/profile']); } this.spinner = false; },
      error: (err) => { this.snackBar.open(err.message || 'Error', 'Close', { duration: 5000, panelClass: ['error-snackbar'] }); this.spinner = false; },
    });
  }
}
