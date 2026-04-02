import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showFromTo',
  standalone: true,
})
export class ShowFromToPipe implements PipeTransform {
  transform(value: {
    from?: number;
    to?: number;
    totalItems?: number;
  }): string {
    const from = value.from || 0;
    const to = value.to || 0;
    const total = value.totalItems || 0;
    return `Showing ${from} to ${to} of ${total}`;
  }
}
