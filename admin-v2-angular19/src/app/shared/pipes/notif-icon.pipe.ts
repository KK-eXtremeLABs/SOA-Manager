import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notifIcon',
  standalone: true,
})
export class NotifIconPipe implements PipeTransform {
  transform(value: string | null, placeholder = 'bell'): string {
    switch (value) {
      case 'application':
        return 'file-alt';
      case 'user':
        return 'user';
      case 'notice':
        return 'bullhorn';
      case 'task':
        return 'tasks';
      case 'job':
        return 'briefcase';
      default:
        return placeholder;
    }
  }
}
