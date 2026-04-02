import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';

import { NotificationsService } from '../notifications.service';
import { ProfileService } from '../../../core/services/profile.service';
import { NotifIconPipe } from '../../../shared/pipes/notif-icon.pipe';

@Component({
  selector: 'app-list-notifications',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, NgxPaginationModule, NotifIconPipe,
  ],
  templateUrl: './list-notifications.component.html',
  styleUrl: './list-notifications.component.scss',
})
export class ListNotificationsComponent implements OnInit {
  pageLoader = false;
  profile: any;
  dataList: any[] = [];
  unreadNotifications = 0;
  searchSubject = '';

  paginator: any = {
    itemsPerPage: 15,
    currentPage: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  };

  constructor(
    private router: Router,
    private notifications: NotificationsService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.getData();
  }

  getData(): void {
    this.pageLoader = true;
    const filter: any = {
      where: [{ column: 'user_id', value: this.profile.id }],
      orderBy: { created_at: 'desc' },
    };
    if (this.searchSubject) {
      filter.where.push({ column: 'subject', operator: 'like', value: `%${this.searchSubject}%` });
    }

    this.notifications.getList(filter, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.dataList = data.record.data;
          const p = data.record.paginator;
          this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page };
        }
        this.pageLoader = false;
      },
      error: () => { this.pageLoader = false; },
    });

    this.notifications.getUnreadCount().subscribe((resp: any) => {
      this.unreadNotifications = resp.record || 0;
    });
  }

  search(): void {
    this.paginator.currentPage = 1;
    this.getData();
  }

  clearFilter(): void {
    this.searchSubject = '';
    this.search();
  }

  changePage(page: number): void {
    this.paginator.currentPage = page;
    this.getData();
  }

  markAsRead(item: any): void {
    item.is_read = 1;
    this.unreadNotifications = Math.max(0, this.unreadNotifications - 1);
    this.notifications.markIsRead(item.id).subscribe();
  }

  markAllAsRead(): void {
    this.dataList.forEach((el) => (el.is_read = 1));
    this.unreadNotifications = 0;
    this.notifications.markAllIsRead().subscribe();
  }

  openNotification(item: any): void {
    const route = this.notifications.route(item);
    if (Array.isArray(route)) {
      this.router.navigate([route[0]], route[1]);
    } else {
      this.router.navigateByUrl(route);
    }
    if (!item.is_read) this.markAsRead(item);
  }
}
