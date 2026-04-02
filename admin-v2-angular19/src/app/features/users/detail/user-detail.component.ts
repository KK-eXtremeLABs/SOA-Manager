import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { UserService } from '../user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { AvatarPipe } from '../../../shared/pipes/avatar.pipe';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule,
    AvatarPipe,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  pageLoader = false;
  user: any;
  profile: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.pageLoader = true;
      this.userService.getOne(id, ['role', 'user_type', 'company', 'role.permissions', 'associations']).subscribe({
        next: (data: any) => {
          if (data.status === 'success') this.user = data.record;
          this.pageLoader = false;
        },
        error: () => { this.pageLoader = false; },
      });
    } else {
      this.user = this.profile;
    }
  }
}
