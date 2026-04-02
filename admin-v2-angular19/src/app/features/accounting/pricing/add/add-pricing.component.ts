import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingService } from '../pricing.service';
@Component({
  selector: 'app-add-pricing', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="hdr"><h4>{{ pricingId ? 'Edit' : 'Add' }} Pricing</h4><a mat-stroked-button routerLink="/accounting/pricing/list"><mat-icon>chevron_left</mat-icon> Back</a></div>
    <mat-card class="fc"><mat-card-content><form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="fw"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
      <mat-form-field appearance="outline" class="fw"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="3"></textarea></mat-form-field>
      <div class="gr"><mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Type</mat-label><mat-select formControlName="type"><mat-option value="monthly">Monthly</mat-option><mat-option value="yearly">Yearly</mat-option></mat-select></mat-form-field></div>
      <div class="fa"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid||spinner">@if(spinner){<mat-spinner diameter="20"></mat-spinner>}@else{<mat-icon>save</mat-icon>}<span>Save</span></button></div>
    </form></mat-card-content></mat-card>
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h4{color:#c4272e;margin:0}.fc{max-width:600px}.fw{width:100%}.gr{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}.fa{text-align:right;margin-top:8px}button{display:inline-flex;align-items:center;gap:8px}'],
})
export class AddPricingComponent implements OnInit {
  form!:FormGroup;spinner=false;pricingId:number|null=null;
  constructor(private fb:FormBuilder,private pricing:PricingService,private route:ActivatedRoute,private router:Router,private snackBar:MatSnackBar){}
  ngOnInit(){this.pricingId=this.route.snapshot.params['id']?+this.route.snapshot.params['id']:null;
    this.form=this.fb.group({name:['',Validators.required],description:[''],amount:[0,Validators.required],type:['monthly',Validators.required]});
    if(this.pricingId)this.pricing.getOne(this.pricingId).subscribe((d:any)=>{if(d.status==='success')this.form.patchValue(d.record);});}
  save(){if(this.form.invalid)return;this.spinner=true;const obs=this.pricingId?this.pricing.update(this.pricingId,this.form.value):this.pricing.create(this.form.value);
    obs.subscribe({next:()=>{this.snackBar.open('Saved','Close',{duration:3000});this.spinner=false;this.router.navigate(['/accounting/pricing/list']);},error:()=>{this.spinner=false;}});}
}
