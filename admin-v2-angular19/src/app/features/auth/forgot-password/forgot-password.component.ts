import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  formSpinner = false;
  showForm = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    this.errorMessage = null;
    if (this.forgotPasswordForm.invalid) return;

    this.formSpinner = true;
    this.auth.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.showForm = false;
          this.snackBar.open('Reset password link sent to your email!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.successMessage = resp.message;
        }
        this.formSpinner = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.formSpinner = false;
      },
    });
  }
}
