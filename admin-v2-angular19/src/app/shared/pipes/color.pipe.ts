import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'color',
  standalone: true,
})
export class ColorPipe implements PipeTransform {
  private readonly colors: Record<string, string> = {
    CS: '#000',
    RI: '#007E33',
    TP: '#CC0000',
    HB: '#00C851',
    FO: '#ff4444',
    WP: '#ffd54f',
    MO: '#ffbb33',
    MI: '#33b5e5',
    AD: '#00695c',
    OP: '#00C851',
    draft: '#000',
    successful: '#007E33',
    unsuccessful: '#CC0000',
    approved: '#00C851',
    declined: '#ff4444',
    pending: '#ffd54f',
    onhold: '#ffbb33',
    cancelled: '#33b5e5',
    completed: '#00695c',
    processed: '#00C851',
    wait_for_documents: '#54d76a',
    security_clear: '#00C851',
    noc_issued: '#ffd54f',
    refund: '#54d76a',
    payment_clear: '#00C851',
    expired: '#ff4444',
    online_payment: 'card-orange',
    access_card: 'card-red',
    movein: 'card-green',
    moveout: 'card-gb',
    work_permit: 'card-yellow',
    fitout: 'card-violet',
    hall_booking: 'card-indigo',
    transfer_property: 'card-blue',
    concierge: 'card-pink',
    contribute: '#458',
    'not paid': '#ff4444',
    'payment sent': '#007E33',
    paid: '#007E33',
    active: '#007E33',
    suspended: '#ff4444',
    rejected: '#ff4444',
    extended: '#ffd54f',
    current_year_budget: '#00C851',
    not_current_year_budget: '#F55F00',
    no_subscribers: '#F55F00',
  };

  private readonly defaultColor = '#9e9e9e';

  transform(value: string | null, defaultC?: string): string {
    if (!value) return defaultC || this.defaultColor;
    return (
      this.colors[value.toLowerCase()] || defaultC || this.defaultColor
    );
  }
}
