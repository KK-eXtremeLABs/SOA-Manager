import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        &copy; Copyright {{ year }} <strong>Iskaan Tech (Dtec).</strong> All Rights Reserved.
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background-color: var(--iskaan-footer);
        color: #ccc;
        text-align: center;
        font-size: 0.8rem;
        padding: 12px 0;
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
