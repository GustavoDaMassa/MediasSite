import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ProjectionsService } from '../projections.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-projection-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './projection-form.component.html',
  styleUrl: './projection-form.component.scss',
})
export class ProjectionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly projectionsService = inject(ProjectionsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(false);
  readonly isEditMode = signal(false);
  courseId = 0;
  projectionId = 0;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.params['courseId']);
    const projId = this.route.snapshot.params['projectionId'];
    if (projId) {
      this.projectionId = Number(projId);
      this.isEditMode.set(true);
      this.loadProjection();
    }
  }

  private loadProjection(): void {
    this.loading.set(true);
    this.projectionsService.list(this.courseId).subscribe({
      next: (projections) => {
        const projection = projections.find((p) => p.id === this.projectionId);
        if (projection) {
          this.form.patchValue({ name: projection.name });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { name } = this.form.getRawValue();

    if (this.isEditMode()) {
      this.projectionsService.updateName(this.courseId, this.projectionId, name).subscribe({
        next: () => {
          this.notification.success(this.translate.instant('common.updated'));
          this.router.navigate(['/courses', this.courseId, 'projections']);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.projectionsService.create(this.courseId, name).subscribe({
        next: () => {
          this.notification.success(this.translate.instant('common.created'));
          this.router.navigate(['/courses', this.courseId, 'projections']);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
