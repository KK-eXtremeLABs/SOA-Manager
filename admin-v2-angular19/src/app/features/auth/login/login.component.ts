import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../auth.service';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  error: string | null = null;
  loginForm: FormGroup;
  formSpinner = false;
  returnUrl: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private tokenService: TokenService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'];
    });
  }

  submit(): void {
    this.error = null;
    if (this.loginForm.invalid) return;

    this.formSpinner = true;
    this.auth
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (resp: any) => {
          if (resp.access_token) {
            this.tokenService.setToken(resp.access_token);
            this.profileService.getProfile().subscribe((response: any) => {
              if (response.record.company?.type) {
                this.error = 'You are not authorized';
                this.auth.logout().subscribe();
              } else {
                if (
                  !response.record.google2fa_setup_account ||
                  !response.record.google2fa_authentication
                ) {
                  this.router.navigateByUrl('2FA');
                } else {
                  this.router.navigateByUrl(this.returnUrl || '/');
                }
              }
            });
          } else {
            this.error = 'Invalid username or password';
          }
          this.formSpinner = false;
        },
        error: (error) => {
          this.formSpinner = false;
          this.error = error.message;
        },
      });
  }
}
