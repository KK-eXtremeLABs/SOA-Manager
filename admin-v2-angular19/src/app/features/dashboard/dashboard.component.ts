import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfileService } from '../../core/services/profile.service';
import { StatisticsService } from '../statistics/statistics.service';
import { CanAccessPipe } from '../../shared/pipes/can-access.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CanAccessPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  profile: any;
  statistics: any;
  eserviceStatistics: any;

  constructor(
    private titleService: Title,
    private profileService: ProfileService,
    private statisticsService: StatisticsService
  ) {
    this.titleService.setTitle('Dashboard');
  }

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.getData();
  }

  getData(): void {
    this.statisticsService.getStatisticsCount().subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.statistics = resp.record;
        }
      },
    });

    this.statisticsService.getEservicesCount().subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.eserviceStatistics = resp.record;
        }
      },
    });
  }
}
