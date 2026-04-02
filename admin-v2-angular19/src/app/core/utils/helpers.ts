import { FormArray, FormGroup } from '@angular/forms';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  addDays,
  addYears,
} from 'date-fns';
import CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export class Helpers {
  static buildWhere(searchData: any): any[] {
    const searchArr = JSON.parse(JSON.stringify(searchData));
    const where: any[] = [];
    for (const key in searchArr) {
      if (searchArr.hasOwnProperty(key)) {
        const column = searchArr[key];
        if (
          !this.empty(column.value) ||
          column.value === 0 ||
          column.value === '0'
        ) {
          if (column.operator === 'like') {
            column.value = `%${column.value}%`;
          }
          delete column.displayValue;
          where.push(column);
        }
      }
    }
    return where;
  }

  static empty(mixedVar: any): boolean {
    const emptyValues = [undefined, null, false, 0, '', '0'];
    for (const val of emptyValues) {
      if (mixedVar === val) return true;
    }
    if (typeof mixedVar === 'object') {
      for (const key in mixedVar) {
        if (mixedVar.hasOwnProperty(key)) return false;
      }
      return true;
    }
    return false;
  }

  static getSelectedOptions(options: any): string[] | null {
    if (!options) return null;
    return Object.keys(options).filter((key) => options[key]);
  }

  static getUnselectedOptions(options: any): string[] | null {
    if (!options) return null;
    return Object.keys(options).filter((key) => !options[key]);
  }

  static isValidDate(value: string): boolean {
    return Date.parse(value) > 0;
  }

  static cleanMobileNumber(value: string): string {
    if (value && value.length > 4) {
      return value.replace('+', '').replace(/ /g, '');
    }
    return '';
  }

  static cloneObj<T>(json: T): T {
    return JSON.parse(JSON.stringify(json));
  }

  static inArray(needle: any, haystack: any[], strict = false): boolean {
    if (strict) {
      return haystack.some((item) => item === needle);
    }
    return haystack.some((item) => item == needle);
  }

  static removeFromArray(
    needle: any,
    haystack: any[],
    field: string | null = null
  ): any[] {
    if (field) {
      return haystack.filter((el: any) => el[field] != needle);
    }
    const index = haystack.indexOf(needle);
    if (index > -1) {
      haystack.splice(index, 1);
    }
    return haystack;
  }

  static removeDuplicates(array: any[], prop: string): any[] {
    return array.filter(
      (obj, pos, arr) =>
        arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos
    );
  }

  static thumbUrl(url: string): string {
    if (!url) return url;
    return url.replace(/\/([^/]*)$/, '/thumbnails/$1');
  }

  static displayFormErrors(form: FormGroup | FormArray): void {
    for (const key in form.controls) {
      const formElement = form.get(key);
      if (formElement) {
        formElement.markAsTouched();
        formElement.markAsDirty();
        if (
          formElement instanceof FormGroup ||
          formElement instanceof FormArray
        ) {
          Helpers.displayFormErrors(formElement);
        }
      }
    }
  }

  static displayFieldErrors(form: FormGroup, field: string): void {
    form.controls[field]?.markAsTouched();
    form.controls[field]?.markAsDirty();
  }

  static exportOptions(
    total: number,
    limit: number
  ): { start: number; end: number; page: number }[] {
    const exportOptions: { start: number; end: number; page: number }[] = [];
    const pages = Math.ceil(total / limit);
    for (let page = 1; page <= pages; page++) {
      const _end = page * limit;
      const start = _end - limit + 1;
      const end = _end < total ? _end : total;
      exportOptions.push({ start, end, page });
    }
    return exportOptions;
  }

  static getDateRange(value: string): { from: string; to: string } {
    const resp = { from: '', to: '' };
    const now = new Date();
    const fmt = (d: Date) => format(d, DATE_FORMAT);

    switch (value) {
      case 'custom':
        break;
      default:
      case 'today':
        resp.from = fmt(startOfDay(now));
        resp.to = fmt(endOfDay(now));
        break;
      case 'yesterday':
        resp.from = fmt(startOfDay(subDays(now, 1)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'as_of_today':
        resp.from = fmt(startOfYear(new Date(2010, 0, 1)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'last_3_days':
        resp.from = fmt(startOfDay(subDays(now, 3)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'last_30_days':
        resp.from = fmt(startOfDay(subDays(now, 30)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'last_60_days':
        resp.from = fmt(startOfDay(subDays(now, 60)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'last_90_days':
        resp.from = fmt(startOfDay(subDays(now, 90)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'this_week':
        resp.from = fmt(startOfWeek(now));
        resp.to = fmt(endOfWeek(now));
        break;
      case 'this_month':
        resp.from = fmt(startOfMonth(now));
        resp.to = fmt(endOfMonth(now));
        break;
      case 'this_quarter':
        resp.from = fmt(startOfQuarter(now));
        resp.to = fmt(endOfQuarter(now));
        break;
      case 'this_year':
        resp.from = fmt(startOfYear(now));
        resp.to = fmt(endOfYear(now));
        break;
      case 'last_week':
        resp.from = fmt(startOfWeek(subWeeks(now, 1)));
        resp.to = fmt(endOfWeek(subWeeks(now, 1)));
        break;
      case 'last_month':
        resp.from = fmt(startOfMonth(subMonths(now, 1)));
        resp.to = fmt(endOfMonth(subMonths(now, 1)));
        break;
      case 'last_quarter':
        resp.from = fmt(startOfQuarter(subQuarters(now, 1)));
        resp.to = fmt(endOfQuarter(subQuarters(now, 1)));
        break;
      case 'last_year':
        resp.from = fmt(startOfYear(subYears(now, 1)));
        resp.to = fmt(endOfYear(subYears(now, 1)));
        break;
      case 'post_dated':
        resp.from = fmt(startOfDay(addDays(now, 1)));
        resp.to = fmt(addYears(now, 1));
        break;
      case 'all':
        resp.from = fmt(startOfYear(new Date(2010, 0, 1)));
        resp.to = fmt(endOfYear(addYears(now, 10)));
        break;
      case 'to_date':
        resp.from = fmt(startOfYear(new Date(2010, 0, 1)));
        resp.to = fmt(endOfDay(now));
        break;
      case 'ytd':
        resp.from = fmt(startOfYear(now));
        resp.to = fmt(endOfDay(now));
        break;
    }
    return resp;
  }

  static groupBy(
    array: any[],
    key: string
  ): { key: string; items: any[] }[] {
    const group = array.reduce((r: any, a: any) => {
      r[a[key]] = [...(r[a[key]] || []), a];
      return r;
    }, {});
    return Object.entries(group).map(([k, v]) => ({ key: k, items: v as any[] }));
  }

  static downloadFile(file: Blob, name: string): void {
    const data = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = data;
    link.download = name + '-' + Date.now();
    link.target = '_blank';
    link.click();
  }

  static encryptData(value: any): string {
    const key = CryptoJS.enc.Hex.parse(environment.whiteKey);
    const iv = CryptoJS.enc.Hex.parse(environment.blueKey);
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      key,
      { iv }
    ).toString();
    return encodeURIComponent(encrypted);
  }

  static decryptData(value: string): any {
    const key = CryptoJS.enc.Hex.parse(environment.whiteKey);
    const iv = CryptoJS.enc.Hex.parse(environment.blueKey);
    const decoded = decodeURIComponent(value.trim());
    const decrypted = CryptoJS.AES.decrypt(decoded, key, { iv }).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }

  static validateForm(form: FormGroup | FormArray): void {
    for (const key in form.controls) {
      const formElement = form.get(key);
      if (formElement) {
        formElement.updateValueAndValidity();
        if (
          formElement instanceof FormGroup ||
          formElement instanceof FormArray
        ) {
          Helpers.validateForm(formElement);
        }
      }
    }
  }
}
