import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon',
  standalone: true,
})
export class IconPipe implements PipeTransform {
  private readonly icons: Record<string, string> = {
    online_payment: 'credit-card',
    access_card: 'address-card',
    movein: 'dolly',
    moveout: 'truck',
    work_permit: 'briefcase',
    fitout: 'gavel',
    hall_booking: 'calendar',
    transfer_property: 'home',
    concierge: 'bell',
  };

  private readonly defaultIcon = '#9e9e9e';

  transform(value: string | null, defaultC?: string): string {
    if (!value) return defaultC || this.defaultIcon;
    return this.icons[value] || defaultC || this.defaultIcon;
  }
}
