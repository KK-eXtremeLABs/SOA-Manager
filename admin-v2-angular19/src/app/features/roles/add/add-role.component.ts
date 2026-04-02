import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService } from '../roles.service';
@Component({
  selector: 'app-add-role', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="hdr"><h3>{{ roleId ? 'Edit' : 'Add' }} Role</h3><a mat-stroked-button routerLink="/roles"><mat-icon>chevron_left</mat-icon> Back</a></div>
    <mat-card class="fc"><mat-card-content><form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="fw"><mat-label>Title</mat-label><input matInput formControlName="title" /></mat-form-field>
      <mat-form-field appearance="outline" class="fw"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="3"></textarea></mat-form-field>
      @if (permissions.length) { <h5>Permissions</h5><div class="perms">@for (p of permissions; track p.id) { <mat-checkbox [checked]="selectedPerms.includes(p.id)" (change)="togglePerm(p.id)">{{ p.title }}</mat-checkbox> }</div> }
      <div class="fa"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid||spinner">@if(spinner){<mat-spinner diameter="20"></mat-spinner>}@else{<mat-icon>save</mat-icon>}<span>Save</span></button></div>
    </form></mat-card-content></mat-card>
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h3{color:#c4272e;margin:0}.fc{max-width:700px}.fw{width:100%}h5{margin:16px 0 8px;color:#333}.perms{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}@media(max-width:768px){.perms{grid-template-columns:1fr}}.fa{text-align:right}button{display:inline-flex;align-items:center;gap:8px}'],
})
export class AddRoleComponent implements OnInit {
  form!:FormGroup;spinner=false;roleId:number|null=null;permissions:any[]=[];selectedPerms:number[]=[];
  constructor(private fb:FormBuilder,private roles:RolesService,private route:ActivatedRoute,private router:Router,private snackBar:MatSnackBar){}
  ngOnInit(){this.roleId=this.route.snapshot.params['id']?+this.route.snapshot.params['id']:null;
    this.form=this.fb.group({title:['',Validators.required],description:['']});
    if(this.roleId){this.roles.getOne(this.roleId,['permissions']).subscribe((d:any)=>{if(d.status==='success'){this.form.patchValue(d.record);this.selectedPerms=(d.record.permissions||[]).map((p:any)=>p.id);}});
    this.roles.getRolePermissions(this.roleId).subscribe((d:any)=>{this.permissions=d.record||[];});}}
  togglePerm(id:number){const i=this.selectedPerms.indexOf(id);if(i>-1)this.selectedPerms.splice(i,1);else this.selectedPerms.push(id);}
  save(){if(this.form.invalid)return;this.spinner=true;const data={...this.form.value,permissions:this.selectedPerms};
    const obs=this.roleId?this.roles.update(this.roleId,data):this.roles.create(data);
    obs.subscribe({next:()=>{this.snackBar.open('Saved','Close',{duration:3000});this.spinner=false;this.router.navigate(['/roles']);},error:()=>{this.spinner=false;}});}
}
