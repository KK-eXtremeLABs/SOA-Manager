import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _profile: any = null;
  private _isLoggedIn = false;
  private _isProfileLoaded = false;

  constructor(private http: HttpClient) {}

  async isLoggedIn(): Promise<boolean> {
    if (!this._isProfileLoaded) {
      await firstValueFrom(this.getProfile()).catch(() => {});
    }
    return this._isLoggedIn;
  }

  get isProfileLoaded(): boolean {
    return this._isProfileLoaded;
  }

  get profile(): any {
    return this._profile;
  }

  set profile(profile: any) {
    this._isProfileLoaded = true;
    if (profile) {
      this._isLoggedIn = true;
      this._profile = profile;
    } else {
      this._isLoggedIn = false;
      this._profile = null;
    }
  }

  getProfile() {
    const path = environment.adminUrl + 'profile';
    return this.http.get(path).pipe(
      tap({
        next: (response: any) => {
          if (response.record.company?.type) {
            this.profile = null;
          } else {
            this.profile = response.record;
            this.profile.permissions = this.profile.role.permissions.map(
              (perm: any) => perm.name
            );
          }
        },
      })
    );
  }
}
