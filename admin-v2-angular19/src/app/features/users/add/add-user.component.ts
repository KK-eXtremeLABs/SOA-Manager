import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../user.service';
import { RolesService } from '../../roles/roles.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatCardModule, MatProgressSpinnerModule, MatCheckboxModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  pageLoader = false;
  formSpinner = false;
  profile: any;
  userForm!: FormGroup;
  userId: number | null = null;
  user: any;
  backLink = '/users';
  optionsRole: { value: number; label: string }[] = [];
  permissionsList: any[] = [];
  private _ref: string | null = null;

  constructor(
    private titleService: Title,
    private rolesService: RolesService,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.profile = this.profileService.profile;
    this.userId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this._ref = this.route.snapshot.queryParamMap.get('_ref');
    this.backLink = this._ref ? '/' + this._ref : '/users';
    this.titleService.setTitle(this.userId ? 'Edit User' : 'Add User');

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.userId ? [] : [Validators.required]],
      confirm_password: [''],
      role_id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile: ['', Validators.required],
      dob: [''],
      passport_number: [''],
      passport_expiry: [''],
      emirates_id: [''],
      emirates_id_expiry: [''],
      profile_picture: [''],
      id: [''],
      company_id: [''],
    });

    this.rolesService.getList({
      where: [{ column: 'company_id', value: this.profile.company_id }],
    }).subscribe((data: any) => {
      (data.record || []).forEach((r: any) => {
        this.optionsRole.push({ value: r.id, label: r.title });
      });
    });

    if (this.userId) this.getData();
  }

  getData(): void {
    this.pageLoader = true;
    this.userService.getOne(this.userId!, ['role', 'user_type', 'company', 'role.permissions', 'associations']).subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.user = data.record;
          this.permissionsList = this.user.role?.permissions || [];
          this.userForm.patchValue(this.user);
        } else {
          this.snackBar.open('Error loading user', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
        this.pageLoader = false;
      },
      error: () => { this.pageLoader = false; },
    });
  }

  changeRole(roleId: number): void {
    this.rolesService.getRolePermissions(roleId).subscribe((data: any) => {
      this.permissionsList = data.record || [];
    });
  }

  saveUser(): void {
    Helpers.displayFormErrors(this.userForm);
    if (this.userForm.invalid) return;

    const formdata = Helpers.cloneObj(this.userForm.value);
    formdata.username = formdata.email;
    this.formSpinner = true;

    const obs = this.userId
      ? this.userService.update(this.userId, formdata)
      : this.userService.create(formdata);

    obs.subscribe({
      next: (data: any) => {
        const msg = this.userId ? 'User updated successfully' : 'User created successfully';
        this.snackBar.open(data.status === 'success' ? msg : 'Error saving user', 'Close', {
          duration: 3000, panelClass: [data.status === 'success' ? 'success-snackbar' : 'error-snackbar'],
        });
        this.formSpinner = false;
        this.router.navigate([this._ref || '/users']);
      },
      error: (error: any) => {
        if (error.error?.code === 400) {
          Object.values(error.error.errors || {}).forEach((val: any) => {
            this.snackBar.open(val[0], 'Close', { duration: 10000, panelClass: ['error-snackbar'] });
          });
        } else {
          this.snackBar.open('Error saving user', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
        this.formSpinner = false;
      },
    });
  }
}
