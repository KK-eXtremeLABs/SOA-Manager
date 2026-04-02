import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';

import { UserService } from '../user.service';
import { RolesService } from '../../roles/roles.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';
import { CanAccessPipe } from '../../../shared/pipes/can-access.pipe';
import { AvatarPipe } from '../../../shared/pipes/avatar.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxPaginationModule,
    CanAccessPipe,
    AvatarPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  pageLoader = false;
  error: string | null = null;
  profile: any;
  dataList: any[] = [];
  roleList: any[] = [];
  deleteItem: any = {};
  selectedItem: any;

  order: any = { first_name: 'asc', last_name: 'asc' };
  include: any = ['role', 'company', 'block_user'];
  where: any[] = [];
  searchData: any = {
    first_name: { column: 'first_name', operator: 'like', value: '' },
    last_name: { column: 'last_name', operator: 'like', value: '' },
    email: { column: 'email', operator: 'like', value: '' },
    mobile: { column: 'mobile', operator: 'like', value: '' },
    role_id: { column: 'role_id', operator: '=', value: '' },
  };
  paginator: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  };

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private userService: UserService,
    private rolesService: RolesService,
    private profileService: ProfileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.titleService.setTitle('Users');
  }

  ngOnInit(): void {
    this.profile = this.profileService.profile;

    this.route.queryParams.subscribe((params) => {
      this.paginator.currentPage = params['page'] || 1;
      this.search();
    });

    const roleFilter = {
      columns: ['id', 'title'],
      where: [{ column: 'company_id', value: [this.profile.company_id] }],
      orderBy: { name: 'asc' },
    };
    this.rolesService.getList(roleFilter).subscribe((resp: any) => {
      this.roleList = resp.record || [];
    });
  }

  getData(): void {
    this.error = null;
    this.pageLoader = true;
    const filter = { where: this.where, orderBy: this.order, include: this.include };
    this.userService
      .getList(filter, this.paginator.currentPage, this.paginator.itemsPerPage)
      .subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            this.dataList = data.record.data;
            this.setPagination(data.record.paginator);
          } else {
            this.snackBar.open(data.error?.message || 'Error loading users', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          }
          this.pageLoader = false;
        },
        error: (err) => {
          this.error = err.message;
          this.pageLoader = false;
        },
      });
  }

  search(): void {
    this.where = Helpers.buildWhere(this.searchData);
    this.where.push({ column: 'company_id', value: this.profile.company_id });
    this.where.push({ column: 'id', operator: '!=', value: this.profile.id });
    this.getData();
  }

  setPagination(paginator: any): void {
    this.paginator = { ...this.paginator, ...paginator };
    this.paginator.totalItems = paginator.total;
    this.paginator.currentPage = paginator.current_page;
  }

  sort(column: string): void {
    if (this.order.hasOwnProperty(column)) {
      this.order[column] = this.order[column] === 'asc' ? 'desc' : 'asc';
    } else {
      this.order = { [column]: 'asc' };
    }
    this.search();
  }

  clearFilter(): void {
    for (const key in this.searchData) {
      this.searchData[key].value = '';
    }
    this.search();
  }

  changePage(page: number): void {
    this.paginator.currentPage = page;
    this.search();
  }

  confirmDelete(item: any): void {
    this.deleteItem = item;
  }

  deleteUser(): void {
    this.pageLoader = true;
    this.userService.delete(this.deleteItem.id).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.dataList = this.dataList.filter((el) => el.id !== this.deleteItem.id);
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        }
        this.pageLoader = false;
        this.deleteItem = {};
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error deleting user', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.pageLoader = false;
      },
    });
  }

  toggleTwoFa(item: any): void {
    this.userService.toggleTwoFa({ id: item.id, status: item.is_2fa_enabled }).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.snackBar.open('2FA status updated', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.getData();
        }
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error toggling 2FA', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  resetTwoFa(item: any): void {
    this.userService.resetTwoFa(item.id).subscribe({
      next: (resp: any) => {
        if (resp.status === 'success') {
          this.snackBar.open('2FA reset successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.getData();
        }
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error resetting 2FA', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
