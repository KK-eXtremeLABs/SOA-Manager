import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorsService } from '../vendors.service';
@Component({
  selector: 'app-verify-vendor', standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `<mat-card><mat-card-header><mat-card-title>Verify Vendor</mat-card-title></mat-card-header><mat-card-content><p>Send verification email to the vendor to verify their account.</p><button mat-raised-button color="primary" (click)="sendVerification()"><mat-icon>mail</mat-icon> Send Verification Email</button></mat-card-content></mat-card>`,
})
export class VerifyVendorComponent {
  @Input() vendorId!:number;
  constructor(private vendor:VendorsService,private snackBar:MatSnackBar){}
  sendVerification(){this.vendor.getOne(this.vendorId).subscribe({next:()=>{this.snackBar.open('Verification email sent','Close',{duration:3000});}});}
}
