import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AssessmentsService } from '../assessments.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssessmentDTO } from '../../../shared/models';

@Component({
  selector: 'app-assessment-grade',
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
    DecimalPipe,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './assessment-grade.component.html',
  styleUrl: './assessment-grade.component.scss',
})
export class AssessmentGradeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly assessmentsService = inject(AssessmentsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(false);
  readonly loadingData = signal(true);
  readonly assessment = signal<AssessmentDTO | null>(null);

  courseId = 0;
  projectionId = 0;
  assessmentId = 0;

  readonly form = this.fb.nonNullable.group({
    value: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.params['courseId']);
    this.projectionId = Number(this.route.snapshot.params['projectionId']);
    this.assessmentId = Number(this.route.snapshot.params['assessmentId']);

    this.assessmentsService.list(this.projectionId).subscribe({
      next: (assessments) => {
        const found = assessments.find((a) => a.id === this.assessmentId);
        if (found) {
          this.assessment.set(found);
          this.form.controls.value.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(found.maxValue),
          ]);
          this.form.patchValue({ value: found.grade });
        }
        this.loadingData.set(false);
      },
      error: () => this.loadingData.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { value } = this.form.getRawValue();

    this.assessmentsService.updateGrade(this.projectionId, this.assessmentId, value).subscribe({
      next: () => {
        this.notification.success(this.translate.instant('common.updated'));
        this.router.navigate(['/courses', this.courseId, 'projections']);
      },
      error: () => this.loading.set(false),
    });
  }
}
