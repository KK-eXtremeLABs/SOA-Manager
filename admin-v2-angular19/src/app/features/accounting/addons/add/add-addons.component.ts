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
import { AddonsService } from '../addons.service';
@Component({
  selector: 'app-add-addons', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="hdr"><h4>Add Add-on</h4><a mat-stroked-button routerLink="/accounting/addons/list"><mat-icon>chevron_left</mat-icon> Back</a></div>
    <mat-card class="fc"><mat-card-content><form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="fw"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
      <mat-form-field appearance="outline" class="fw"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="3"></textarea></mat-form-field>
      <mat-form-field appearance="outline" class="fw"><mat-label>Price</mat-label><input matInput type="number" formControlName="price" /></mat-form-field>
      <div class="fa"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid||spinner">@if(spinner){<mat-spinner diameter="20"></mat-spinner>}@else{<mat-icon>save</mat-icon>}<span>Save</span></button></div>
    </form></mat-card-content></mat-card>
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h4{color:#c4272e;margin:0}.fc{max-width:500px}.fw{width:100%}.fa{text-align:right;margin-top:8px}button{display:inline-flex;align-items:center;gap:8px}'],
})
export class AddAddonsComponent implements OnInit {
  form!:FormGroup;spinner=false;
  constructor(private fb:FormBuilder,private addons:AddonsService,private router:Router,private snackBar:MatSnackBar){}
  ngOnInit(){this.form=this.fb.group({name:['',Validators.required],description:[''],price:[0,Validators.required]});}
  save(){if(this.form.invalid)return;this.spinner=true;this.addons.create(this.form.value).subscribe({next:()=>{this.snackBar.open('Created','Close',{duration:3000});this.spinner=false;this.router.navigate(['/accounting/addons/list']);},error:()=>{this.spinner=false;}});}
}
