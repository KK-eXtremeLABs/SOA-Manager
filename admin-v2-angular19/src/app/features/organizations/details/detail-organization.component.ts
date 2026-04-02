import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-detail-organization', standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatProgressSpinnerModule],
  templateUrl: './detail-organization.component.html',
  styleUrl: './detail-organization.component.scss',
})
export class DetailOrganizationComponent implements OnInit {
  pageLoader = false; org: any; id!: number;
  constructor(private route: ActivatedRoute, private orgService: OrganizationService) {}
  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.pageLoader = true;
    this.orgService.getOne(this.id, ['pricing', 'country', 'city']).subscribe({
      next: (d: any) => { if (d.status === 'success') this.org = d.record; this.pageLoader = false; },
      error: () => { this.pageLoader = false; },
    });
  }
}
