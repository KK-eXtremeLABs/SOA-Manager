import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../user.service';

@Component({
  selector: 'app-block-user',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatCardModule,
  ],
  templateUrl: './block-user.component.html',
  styleUrl: './block-user.component.scss',
})
export class BlockUserComponent implements OnChanges {
  @Input() user_id!: number;
  @Input() close = false;
  @Input() embedded = false;
  @Output() onSave = new EventEmitter<boolean>();

  blockForm: FormGroup;
  formSpinner = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.blockForm = this.fb.group({
      reason: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.close) {
      this.blockForm.reset();
    }
  }

  submit(): void {
    if (this.blockForm.invalid) return;
    this.formSpinner = true;
    const data = { ...this.blockForm.value, user_id: this.user_id };
    this.userService.block(data).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.snackBar.open('User blocked successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.onSave.emit(true);
          this.blockForm.reset();
        }
        this.formSpinner = false;
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error blocking user', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        this.formSpinner = false;
      },
    });
  }
}
