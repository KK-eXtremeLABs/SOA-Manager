import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface EventStructure {
  name: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private subject = new Subject<EventStructure>();

  events(): Observable<EventStructure> {
    return this.subject.asObservable();
  }

  emit(event: EventStructure): void {
    this.subject.next(event);
  }
}
