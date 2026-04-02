import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'amount',
  standalone: true,
})
export class AmountPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en-US');

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, curr = 'AED'): SafeHtml | string {
    if (curr) {
      const formatted = this.currencyPipe.transform(
        value,
        curr,
        'symbol',
        '0.2-2'
      );
      if (!formatted) return '';
      const replaced = formatted.replace(
        'AED',
        '<span class="currency">&#xe001;</span>'
      );
      return this.sanitizer.bypassSecurityTrustHtml(replaced);
    }
    return (
      this.currencyPipe.transform(value, curr + ' ', 'symbol', '0.2-2') || ''
    );
  }
}
