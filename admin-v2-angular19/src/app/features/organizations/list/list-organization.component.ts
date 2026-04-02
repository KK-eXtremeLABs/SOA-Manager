import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrganizationService } from '../organization.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';

@Component({
  selector: 'app-list-organization', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  templateUrl: './list-organization.component.html', styleUrl: './list-organization.component.scss',
})
export class ListOrganizationComponent implements OnInit {
  profile: any; pageLoader = false; dataList: any[] = []; error: string | null = null;
  where: any[] = []; order: any = { company_name: 'asc' }; include = ['pricing'];
  searchData: any = {
    company_name: { column: 'company_name', operator: 'like', value: '' },
    contact_email: { column: 'contact_email', operator: 'like', value: '' },
    contact_number: { column: 'contact_number', operator: 'like', value: '' },
  };
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };

  constructor(private titleService: Title, private route: ActivatedRoute, private orgService: OrganizationService, private profileService: ProfileService, private snackBar: MatSnackBar) { this.titleService.setTitle('Organizations'); }

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.route.queryParams.subscribe(p => { this.paginator.currentPage = p['page'] || 1; this.search(); });
  }
  getData(): void {
    this.error = null; this.pageLoader = true;
    this.orgService.getList({ where: [...this.where, { column: 'type', operator: '=', value: 'oam' }], orderBy: this.order, include: this.include, count: ['associations'] }, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({
      next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || d.record; this.setPagination(d.record.paginator); } this.pageLoader = false; },
      error: (e) => { this.error = e.message; this.pageLoader = false; },
    });
  }
  search(): void { this.where = Helpers.buildWhere(this.searchData); this.getData(); }
  clearFilter(): void { for (const k in this.searchData) this.searchData[k].value = ''; this.search(); }
  sort(col: string): void { this.order = this.order[col] ? { [col]: this.order[col] === 'asc' ? 'desc' : 'asc' } : { [col]: 'asc' }; this.search(); }
  changePage(p: number): void { this.paginator.currentPage = p; this.search(); }
  setPagination(p: any): void { if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; }
}
