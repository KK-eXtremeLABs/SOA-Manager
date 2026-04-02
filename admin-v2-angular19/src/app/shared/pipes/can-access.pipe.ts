import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';

@Pipe({
  name: 'canAccess',
  standalone: true,
  pure: false,
})
export class CanAccessPipe implements PipeTransform {
  constructor(private auth: AuthService) {}

  transform(value: string | string[], strict = false): boolean {
    return this.auth.canAccess(value, strict);
  }
}
