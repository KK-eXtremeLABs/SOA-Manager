import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  pageLoader = true;
  formSpinner = false;
  errorMessage: string | null = null;
  token = '';
  email = '';

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.verifyToken();

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }

  verifyToken(): void {
    this.pageLoader = true;
    this.auth.verifyToken(this.token, this.email).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.router.navigate(['/reset-password'], {
            queryParams: { token: this.token, email: this.email },
            queryParamsHandling: 'preserve',
          });
        } else {
          this.router.navigate(['/forgot-password'], {
            queryParams: { error: '1' },
          });
        }
        this.pageLoader = false;
      },
      error: () => {
        this.router.navigate(['/forgot-password'], {
          queryParams: { error: '1' },
        });
        this.pageLoader = false;
      },
    });
  }

  submit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.formSpinner = true;
    this.auth
      .resetPassword(
        this.email,
        this.token,
        this.resetPasswordForm.value.password,
        this.resetPasswordForm.value.password_confirmation
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.status === 'success') {
            this.snackBar.open(
              'Your password has been successfully updated',
              'Close',
              { duration: 5000, panelClass: ['success-snackbar'] }
            );
            this.router.navigate(['/login']);
          }
          this.formSpinner = false;
        },
        error: () => {
          this.errorMessage = 'Password fields do not match';
          this.formSpinner = false;
        },
      });
  }
}
