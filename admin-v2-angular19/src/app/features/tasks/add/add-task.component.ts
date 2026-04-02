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
import { TasksService } from '../tasks.service';
@Component({
  selector: 'app-add-task', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="hdr"><h3>{{ taskId ? 'Edit' : 'Add' }} Task</h3><a mat-stroked-button routerLink="/tasks"><mat-icon>chevron_left</mat-icon> Back</a></div>
    <mat-card class="fc"><mat-card-content><form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="fw"><mat-label>Title</mat-label><input matInput formControlName="title" /></mat-form-field>
      <div class="gr">
        <mat-form-field appearance="outline"><mat-label>Due Date</mat-label><input matInput type="datetime-local" formControlName="due_at" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Priority</mat-label><mat-select formControlName="priority"><mat-option value="low">Low</mat-option><mat-option value="medium">Medium</mat-option><mat-option value="high">High</mat-option><mat-option value="urgent">Urgent</mat-option></mat-select></mat-form-field>
      </div>
      <mat-form-field appearance="outline" class="fw"><mat-label>Status</mat-label><mat-select formControlName="status"><mat-option value="pending">Pending</mat-option><mat-option value="in_progress">In Progress</mat-option><mat-option value="completed">Completed</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline" class="fw"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="4"></textarea></mat-form-field>
      <div class="fa"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid||spinner">@if(spinner){<mat-spinner diameter="20"></mat-spinner>}@else{<mat-icon>save</mat-icon>}<span>Save</span></button></div>
    </form></mat-card-content></mat-card>
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h3{color:#c4272e;margin:0}.fc{max-width:700px}.fw{width:100%}.gr{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}.fa{text-align:right;margin-top:8px}button{display:inline-flex;align-items:center;gap:8px}'],
})
export class AddTaskComponent implements OnInit {
  form!:FormGroup;spinner=false;taskId:number|null=null;
  constructor(private fb:FormBuilder,private tasks:TasksService,private route:ActivatedRoute,private router:Router,private snackBar:MatSnackBar){}
  ngOnInit(){this.taskId=this.route.snapshot.params['id']?+this.route.snapshot.params['id']:null;
    this.form=this.fb.group({title:['',Validators.required],due_at:[''],priority:['medium'],status:['pending'],description:['']});
    if(this.taskId)this.tasks.getOne(this.taskId).subscribe((d:any)=>{if(d.status==='success')this.form.patchValue(d.record);});}
  save(){if(this.form.invalid)return;this.spinner=true;const obs=this.taskId?this.tasks.update(this.taskId,this.form.value):this.tasks.create(this.form.value);
    obs.subscribe({next:()=>{this.snackBar.open('Saved','Close',{duration:3000});this.spinner=false;this.router.navigate(['/tasks']);},error:()=>{this.spinner=false;}});}
}
