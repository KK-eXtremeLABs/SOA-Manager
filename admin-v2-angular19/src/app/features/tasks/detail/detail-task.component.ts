import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TasksService } from '../tasks.service';
import { ColorPipe } from '../../../shared/pipes/color.pipe';
@Component({
  selector: 'app-detail-task', standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, ColorPipe],
  template: `
    <div class="hdr"><h3>Task Detail</h3><a mat-stroked-button routerLink="/tasks"><mat-icon>chevron_left</mat-icon> Back</a></div>
    @if (loading) { <div style="display:flex;justify-content:center;padding:48px 0"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (task) {
      <div class="dg">
        <mat-card><mat-card-header><mat-card-title>{{ task.title }}</mat-card-title></mat-card-header><mat-card-content>
          <div class="ir"><strong>Status:</strong> <span [style.color]="task.status | color">{{ task.status }}</span></div>
          <div class="ir"><strong>Priority:</strong> {{ task.priority }}</div>
          <div class="ir"><strong>Due Date:</strong> {{ task.due_at | date:'medium' }}</div>
          <div class="ir"><strong>Created By:</strong> {{ task.creator?.full_name }}</div>
          <div class="ir"><strong>Assigned To:</strong> {{ task.assignee?.full_name }}</div>
          <div class="ir"><strong>Description:</strong></div>
          <p class="desc">{{ task.description || 'No description' }}</p>
        </mat-card-content></mat-card>
      </div>
    }
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h3{color:#c4272e;margin:0}.dg{max-width:700px}.ir{padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:.875rem}strong{min-width:120px;display:inline-block}.desc{padding:12px;background:#f5f5f5;border-radius:4px;white-space:pre-wrap}'],
})
export class DetailTaskComponent implements OnInit {
  loading=false;task:any;
  constructor(private route:ActivatedRoute,private tasks:TasksService){}
  ngOnInit(){const id=+this.route.snapshot.params['id'];this.loading=true;
    this.tasks.getOne(id,['creator','assignee']).subscribe({next:(d:any)=>{if(d.status==='success')this.task=d.record;this.loading=false;},error:()=>{this.loading=false;}});}
}
