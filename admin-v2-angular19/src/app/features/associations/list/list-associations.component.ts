import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';

import { AssociationService } from '../association.service';
import { OrganizationService } from '../../organizations/organization.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';
import { CanAccessPipe } from '../../../shared/pipes/can-access.pipe';
import { StatusDotComponent } from '../../../shared/components/status-dot/status-dot.component';

@Component({
  selector: 'app-list-associations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule,
    NgxPaginationModule, CanAccessPipe, StatusDotComponent,
  ],
  templateUrl: './list-associations.component.html',
  styleUrl: './list-associations.component.scss',
})
export class ListAssociationsComponent implements OnInit {
  profile: any;
  pageLoader = false;
  dataList: any[] = [];
  organizationList: any[] = [];
  error: string | null = null;
  status = 'active';

  where: any[] = [];
  order: any = {};
  include = ['oam_company:id,company_name', 'pricing'];
  count = ['units'];

  searchData: any = {
    name: { column: 'name', operator: 'like', value: '' },
    email: { column: 'email', operator: 'like', value: '' },
    phone: { column: 'phone', operator: 'like', value: '' },
    company_id: { column: 'company_id', operator: '=', value: '' },
  };

  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private associationService: AssociationService,
    private organizationService: OrganizationService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
  ) { this.titleService.setTitle('Associations'); }

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.route.queryParams.subscribe((params) => {
      if (params['company_id']) this.searchData.company_id.value = params['company_id'];
      this.paginator.currentPage = params['page'] || 1;
      this.search();
    });
    this.organizationService.getList({
      where: [{ column: 'type', operator: '=', value: 'oam' }], orderBy: { company_name: 'asc' },
    }).subscribe((data: any) => { if (data.status === 'success') this.organizationList = data.record || []; });
  }

  getData(): void {
    this.error = null; this.pageLoader = true;
    this.associationService.getList(
      { where: this.where, orderBy: this.order, include: this.include, count: this.count },
      this.paginator.currentPage, this.paginator.itemsPerPage,
    ).subscribe({
      next: (data: any) => {
        if (data.status === 'success') { this.dataList = data.record.data; this.setPagination(data.record.paginator); }
        this.pageLoader = false;
      },
      error: (err) => { this.error = err.message; this.pageLoader = false; },
    });
  }

  search(): void { this.where = Helpers.buildWhere(this.searchData); this.getData(); }
  clearFilter(): void { for (const key in this.searchData) this.searchData[key].value = ''; this.search(); }
  sort(column: string): void { this.order = this.order[column] ? { [column]: this.order[column] === 'asc' ? 'desc' : 'asc' } : { [column]: 'asc' }; this.search(); }
  changePage(page: number): void { this.paginator.currentPage = page; this.search(); }
  setPagination(p: any): void { this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; }
  filterCommunities(status: string): void { this.status = status; this.paginator.currentPage = 1; this.search(); }
}
