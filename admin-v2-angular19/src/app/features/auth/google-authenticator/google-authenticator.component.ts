import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-google-authenticator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './google-authenticator.component.html',
  styleUrl: './google-authenticator.component.scss',
})
export class GoogleAuthenticatorComponent implements OnInit {
  profile: any;
  TwoFaData: any;
  errorMessage = '';
  verifying = false;
  twoFactorForm!: FormGroup;
  sanitizedQrCode: SafeResourceUrl | null = null;
  handledPaste = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private tokenService: TokenService
  ) {
    this.profile = this.profileService.profile;
    if (!this.profile?.google2fa_setup_account) {
      this.setupTwoFa();
    }
  }

  ngOnInit(): void {
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      secret_key: [null],
    });
  }

  get code() {
    return this.twoFactorForm.get('code');
  }

  onInput(event: any, inputIndex: number): void {
    this.setControlValueAndUpdateForm();
    if (this.handledPaste) {
      this.handledPaste = false;
      this.otpInputs.toArray()[inputIndex].nativeElement.value = '';
      return;
    }

    const inputValue = event.target.value;
    if (event.inputType === 'delete' && inputIndex > 0) {
      const prevInput = this.otpInputs.toArray()[inputIndex - 1];
      prevInput.nativeElement.focus();
      prevInput.nativeElement.value = '';
    } else if (inputValue && inputIndex < this.otpInputs.length - 1) {
      const nextInput = this.otpInputs.toArray()[inputIndex + 1];
      nextInput.nativeElement.focus();
    }
    if (inputValue && inputIndex === this.otpInputs.length - 1) {
      this.setControlValueAndUpdateForm();
      this.onSubmit();
    }
  }

  onKeydown(event: KeyboardEvent, inputIndex: number): void {
    if (event.key === 'Backspace' && inputIndex > 0) {
      const currentInput = this.otpInputs.toArray()[inputIndex];
      currentInput.nativeElement.value = '';
      const prevInput = this.otpInputs.toArray()[inputIndex - 1];
      prevInput.nativeElement.focus();
    }
  }

  handlePaste(event: ClipboardEvent, index: number): void {
    const pastedData = event.clipboardData?.getData('Text') || '';
    if (pastedData.length) {
      const inputs = this.otpInputs.toArray();
      for (let i = index; i < pastedData.length + index && i < inputs.length; i++) {
        inputs[i].nativeElement.value = pastedData[i - index];
      }
    }

    if (
      !this.otpInputs
        .toArray()
        .some((otpInput) => !otpInput.nativeElement.value.length)
    ) {
      this.setControlValueAndUpdateForm();
      this.onSubmit();
    } else if (pastedData.length < this.otpInputs.length) {
      this.otpInputs.toArray()[pastedData.length]?.nativeElement.focus();
    }

    this.handledPaste = true;
  }

  setupTwoFa(): void {
    this.authService.setupTwoFa().subscribe({
      next: (response: any) => {
        this.TwoFaData = response;
        if (!this.profile?.google2fa_setup_account && this.TwoFaData) {
          this.sanitizedQrCode = this.sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/svg+xml;base64,' + this.TwoFaData.record.qr_code
          );
        }
      },
    });
  }

  onSubmit(): void {
    if (this.twoFactorForm.invalid) return;

    this.setSecretKey();
    this.verifying = true;
    const data = this.twoFactorForm.getRawValue();

    this.authService.verifyTwoFa(data).subscribe({
      next: (res: any) => {
        if (res.request_status) {
          this.router.navigate(['/dashboard']);
          this.verifying = false;
        }
        this.clearOtpInputs();
      },
      error: (error) => {
        this.clearOtpInputs();
        this.otpInputs.toArray()[0]?.nativeElement.focus();
        this.errorMessage = error?.error?.errors?.description || 'Verification failed';
        this.verifying = false;
      },
    });
  }

  setControlValueAndUpdateForm(): void {
    const otpValue = this.otpInputs
      .toArray()
      .map((input) => input.nativeElement.value)
      .join('');
    this.twoFactorForm.get('code')?.setValue(otpValue);
    this.twoFactorForm.updateValueAndValidity();
  }

  clearOtpInputs(): void {
    this.otpInputs.forEach((input: ElementRef) => {
      input.nativeElement.value = '';
    });
  }

  setSecretKey(): void {
    if (!this.profile?.google2fa_setup_account) {
      this.twoFactorForm
        .get('secret_key')
        ?.setValue(this.TwoFaData?.record?.secret);
    }
  }

  backToLogin(): void {
    if (this.tokenService.getToken()) {
      this.authService.logout().subscribe(() => {
        this.snackBar.open('You have been successfully logged out', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigateByUrl('/login');
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
