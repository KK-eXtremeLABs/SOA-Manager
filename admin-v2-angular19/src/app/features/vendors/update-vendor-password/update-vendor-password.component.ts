import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorsService } from '../vendors.service';
@Component({
  selector: 'app-update-vendor-password', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `<mat-card><mat-card-header><mat-card-title>Update Password</mat-card-title></mat-card-header><mat-card-content><form [formGroup]="form" (ngSubmit)="submit()"><mat-form-field appearance="outline" class="fw"><mat-label>New Password</mat-label><input matInput type="password" formControlName="password" /></mat-form-field><mat-form-field appearance="outline" class="fw"><mat-label>Confirm Password</mat-label><input matInput type="password" formControlName="password_confirmation" /></mat-form-field><div style="text-align:right"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid||s">@if(s){<mat-spinner diameter="20"></mat-spinner>}@else{<mat-icon>save</mat-icon>}<span>Update</span></button></div></form></mat-card-content></mat-card>`,
  styles: ['.fw{width:100%}button{display:inline-flex;align-items:center;gap:8px}'],
})
export class UpdateVendorPasswordComponent {
  @Input() vendorId!:number;form:FormGroup;s=false;
  constructor(private fb:FormBuilder,private vendor:VendorsService,private snackBar:MatSnackBar){this.form=this.fb.group({password:['',Validators.required],password_confirmation:['',Validators.required]});}
  submit(){if(this.form.invalid)return;this.s=true;this.vendor.update(this.vendorId,this.form.value).subscribe({next:()=>{this.snackBar.open('Password updated','Close',{duration:3000});this.s=false;this.form.reset();},error:()=>{this.s=false;}});}
}
