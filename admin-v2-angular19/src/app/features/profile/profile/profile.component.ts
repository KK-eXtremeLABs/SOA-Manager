import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../../core/services/profile.service';
import { AvatarPipe } from '../../../shared/pipes/avatar.pipe';

@Component({
  selector: 'app-profile', standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, AvatarPipe],
  template: `
    @if (profile) {
      <div class="profile-layout">
        <mat-card class="profile-card text-center">
          <mat-card-content>
            <img [src]="profile.profile_image_url | avatar:profile.full_name" class="avatar" />
            <h3>{{ profile.full_name }}</h3>
            <p class="role">{{ profile.role?.title }}</p>
            <a mat-stroked-button color="primary" routerLink="/profile/edit"><mat-icon>edit</mat-icon> Edit Profile</a>
          </mat-card-content>
        </mat-card>
        <div class="info-cards">
          <mat-card>
            <mat-card-header><mat-card-title>Contact Information</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="info-row"><strong>Email:</strong> {{ profile.email }}</div>
              <div class="info-row"><strong>Mobile:</strong> {{ profile.mobile }}</div>
              <div class="info-row"><strong>DOB:</strong> {{ profile.dob || 'N/A' }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-header><mat-card-title>Security</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="info-row"><strong>2FA:</strong> {{ profile.is_2fa_enabled ? 'Enabled' : 'Disabled' }}</div>
              <a mat-stroked-button routerLink="/profile/change-password"><mat-icon>vpn_key</mat-icon> Change Password</a>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    }
  `,
  styles: [`
    .profile-layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
    .text-center { text-align: center; }
    .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; }
    .role { color: #666; margin-bottom: 16px; }
    .info-cards { display: flex; flex-direction: column; gap: 16px; }
    .info-row { padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.875rem; strong { min-width: 100px; display: inline-block; } }
  `],
})
export class ProfileComponent implements OnInit {
  profile: any;
  constructor(private profileService: ProfileService) {}
  ngOnInit(): void { this.profile = this.profileService.profile; }
}
