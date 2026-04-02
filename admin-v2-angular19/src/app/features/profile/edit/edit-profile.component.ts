import { Component, OnInit } from '@angular/core';
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
import { UserService } from '../../users/user.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-edit-profile', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <section class="sub-header"><div class="header-row"><h3>Edit Profile</h3><a mat-stroked-button routerLink="/profile"><mat-icon>chevron_left</mat-icon> Back</a></div></section>
    <mat-card class="form-card"><mat-card-content>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="first_name" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="last_name" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Mobile</mat-label><input matInput formControlName="mobile" /></mat-form-field>
        </div>
        <div class="form-actions"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || spinner">
          @if (spinner) { <mat-spinner diameter="20"></mat-spinner> } @else { <mat-icon>save</mat-icon> } <span>Save</span>
        </button></div>
      </form>
    </mat-card-content></mat-card>
  `,
  styles: ['.sub-header { padding: 0 0 16px; } .header-row { display: flex; justify-content: space-between; align-items: center; } .header-row h3 { margin: 0; color: #c4272e; } .form-card { max-width: 700px; } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; } @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } } .form-actions { text-align: right; button { display: inline-flex; align-items: center; gap: 8px; } }'],
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup; spinner = false; profile: any;
  constructor(private fb: FormBuilder, private userService: UserService, private profileService: ProfileService, private router: Router, private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.form = this.fb.group({ first_name: [this.profile?.first_name, Validators.required], last_name: [this.profile?.last_name, Validators.required], email: [this.profile?.email, [Validators.required, Validators.email]], mobile: [this.profile?.mobile, Validators.required] });
  }
  submit(): void {
    if (this.form.invalid) return;
    this.spinner = true;
    this.userService.updateProfile(this.form.value).subscribe({
      next: (resp: any) => { if (resp.status === 'success') { this.snackBar.open('Profile updated', 'Close', { duration: 3000, panelClass: ['success-snackbar'] }); this.router.navigate(['/profile']); } this.spinner = false; },
      error: () => { this.snackBar.open('Error updating profile', 'Close', { duration: 5000, panelClass: ['error-snackbar'] }); this.spinner = false; },
    });
  }
}
