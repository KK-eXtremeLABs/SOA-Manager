import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssociationService } from '../association.service';
import { StatusDotComponent } from '../../../shared/components/status-dot/status-dot.component';

@Component({
  selector: 'app-detail-association', standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatProgressSpinnerModule, StatusDotComponent],
  templateUrl: './detail-association.component.html',
  styleUrl: './detail-association.component.scss',
})
export class DetailAssociationComponent implements OnInit {
  pageLoader = false; association: any; id!: number;
  constructor(private route: ActivatedRoute, private assocService: AssociationService, private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.pageLoader = true;
    this.assocService.getOne(this.id, ['oam_company', 'active_company', 'pricing', 'budget']).subscribe({
      next: (d: any) => { if (d.status === 'success') this.association = d.record; this.pageLoader = false; },
      error: () => { this.pageLoader = false; },
    });
  }
}
