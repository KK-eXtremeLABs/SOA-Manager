import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-dot',
  standalone: true,
  imports: [CommonModule],
  template:
    '<span class="status-dot" [ngClass]="cssClass" [ngStyle]="style" [title]="title"></span>',
  styles: [
    `
      .status-dot {
        display: inline-block;
      }
    `,
  ],
})
export class StatusDotComponent implements OnInit {
  @Input() title = '';
  @Input() color = '#00baee';
  @Input() width = '10px';
  @Input() height = '10px';
  @Input() radius = '50%';
  @Input() cssClass = '';

  style: Record<string, string> = {};

  ngOnInit(): void {
    this.style = {
      'background-color': this.color,
      width: this.width,
      height: this.height,
      'border-radius': this.radius,
    };
  }
}
