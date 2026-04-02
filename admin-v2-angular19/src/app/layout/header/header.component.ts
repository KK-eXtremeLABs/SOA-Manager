import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../features/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { NotificationsService } from '../../features/notifications/notifications.service';
import { AvatarPipe } from '../../shared/pipes/avatar.pipe';
import { NotifIconPipe } from '../../shared/pipes/notif-icon.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    DatePipe,
    AvatarPipe,
    NotifIconPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  profile: any;
  notificationList: any[] = [];
  unreadNotifications = 0;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private profileService: ProfileService,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.getNotifications();
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.snackBar.open('You have been successfully logged out', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.router.navigateByUrl('/login');
    });
  }

  getNotifications(): void {
    if (!this.profile) return;
    const filter = {
      where: [{ column: 'user_id', value: this.profile.id }],
      orderBy: { created_at: 'desc' },
    };
    this.notifications.getList(filter, 1, 5).subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.notificationList = data.record.data;
        }
      },
    });

    this.notifications.getUnreadCount().subscribe({
      next: (resp: any) => {
        this.unreadNotifications = resp.record || 0;
      },
    });
  }

  markAllNotifIsRead(): void {
    this.notificationList.forEach((el) => (el.is_read = 1));
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
    this.markNotifIsRead(item);
  }

  markNotifIsRead(item: any): void {
    item.is_read = 1;
    this.unreadNotifications = Math.max(0, this.unreadNotifications - 1);
    this.notifications.markIsRead(item.id).subscribe();
  }
}
