import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VendorsService } from '../vendors.service';
import { ImgSrcPipe } from '../../../shared/pipes/img-src.pipe';

@Component({
  selector: 'app-detail-vendor', standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, ImgSrcPipe],
  templateUrl: './detail-vendor.component.html', styleUrl: './detail-vendor.component.scss',
})
export class DetailVendorComponent implements OnInit {
  pageLoader = false; vendor: any; id!: number;
  constructor(private route: ActivatedRoute, private vendorService: VendorsService) {}
  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.pageLoader = true;
    this.vendorService.getOne(this.id, ['country', 'city']).subscribe({
      next: (d: any) => { if (d.status === 'success') this.vendor = d.record; this.pageLoader = false; },
      error: () => { this.pageLoader = false; },
    });
  }
}
