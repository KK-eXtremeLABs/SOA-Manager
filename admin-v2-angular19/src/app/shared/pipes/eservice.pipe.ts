import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'service',
  standalone: true,
})
export class ServicePipe implements PipeTransform {
  private readonly requestTypes: Record<string, string> = {
    AD: 'Access Device',
    CS: 'Concierge Service',
    WP: 'Work Permit',
    TP: 'Transfer of Property',
    RI: 'Resident Information',
    FO: 'Fit Out',
    MO: 'Move Out',
    MI: 'Move In',
    HB: 'Facility Booking',
  };

  private readonly defaultService = 'E Service';

  transform(value: string | null, defaultS?: string): string {
    if (!value) return defaultS || this.defaultService;
    return this.requestTypes[value] || defaultS || this.defaultService;
  }
}
