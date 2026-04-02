import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { TasksService } from '../tasks.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';
import { CanAccessPipe } from '../../../shared/pipes/can-access.pipe';
import { ColorPipe } from '../../../shared/pipes/color.pipe';

@Component({
  selector: 'app-list-tasks', standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule, CanAccessPipe, ColorPipe],
  templateUrl: './list-tasks.component.html', styleUrl: './list-tasks.component.scss',
})
export class ListTasksComponent implements OnInit {
  pageLoader = false; dataList: any[] = []; error: string | null = null;
  where: any[] = []; order: any = { created_at: 'desc' }; include = ['creator', 'assignee'];
  searchData: any = { title: { column: 'title', operator: 'like', value: '' }, status: { column: 'status', operator: '=', value: '' } };
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };

  constructor(private titleService: Title, private route: ActivatedRoute, private tasksService: TasksService, private profileService: ProfileService, private snackBar: MatSnackBar) { this.titleService.setTitle('Tasks'); }
  ngOnInit(): void { this.route.queryParams.subscribe(p => { this.paginator.currentPage = p['page'] || 1; this.search(); }); }
  getData(): void { this.pageLoader = true; this.tasksService.getList({ where: this.where, orderBy: this.order, include: this.include }, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({ next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || []; const p = d.record.paginator; if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; } this.pageLoader = false; }, error: (e) => { this.error = e.message; this.pageLoader = false; } }); }
  search(): void { this.where = Helpers.buildWhere(this.searchData); this.getData(); }
  clearFilter(): void { for (const k in this.searchData) this.searchData[k].value = ''; this.search(); }
  sort(col: string): void { this.order = this.order[col] ? { [col]: this.order[col] === 'asc' ? 'desc' : 'asc' } : { [col]: 'asc' }; this.search(); }
  changePage(p: number): void { this.paginator.currentPage = p; this.search(); }
  deleteTask(id: number): void { this.tasksService.delete(id).subscribe({ next: () => { this.snackBar.open('Task deleted', 'Close', { duration: 3000 }); this.search(); } }); }
}
