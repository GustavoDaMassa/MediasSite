import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { CoursesService } from '../courses.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-course-form',
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
    MatTooltipModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(false);
  readonly loadingData = signal(false);
  readonly isEditMode = signal(false);

  private courseId = 0;
  private originalValues = { name: '', method: '', cutOff: 6.0 };

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    averageMethod: ['', [Validators.required]],
    cutOffGrade: [6.0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['courseId'];
    if (!id) return;

    this.isEditMode.set(true);
    this.courseId = Number(id);
    this.loadingData.set(true);

    const user = this.authService.currentUser();
    if (!user) return;

    this.coursesService.list(user.id).subscribe({
      next: (courses) => {
        const course = courses.find((c) => c.id === this.courseId);
        if (course) {
          this.form.patchValue({
            name: course.name,
            averageMethod: course.averageMethod,
            cutOffGrade: course.cutOffGrade,
          });
          this.originalValues = {
            name: course.name,
            method: course.averageMethod,
            cutOff: course.cutOffGrade,
          };
        }
        this.loadingData.set(false);
      },
      error: () => this.loadingData.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const user = this.authService.currentUser();
    if (!user) return;

    this.loading.set(true);
    const { name, averageMethod, cutOffGrade } = this.form.getRawValue();

    if (this.isEditMode()) {
      const changes: { name?: string; method?: string; cutOff?: number } = {};
      if (name !== this.originalValues.name) changes.name = name;
      if (averageMethod !== this.originalValues.method) changes.method = averageMethod;
      if (cutOffGrade !== this.originalValues.cutOff) changes.cutOff = cutOffGrade;

      if (Object.keys(changes).length === 0) {
        this.router.navigate(['/courses']);
        return;
      }

      this.coursesService.update(user.id, this.courseId, changes).subscribe({
        next: () => {
          this.notification.success(this.translate.instant('common.updated'));
          this.router.navigate(['/courses']);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.coursesService
        .create(user.id, { name, averageMethod, cutOffGrade })
        .subscribe({
          next: () => {
            this.notification.success(this.translate.instant('common.created'));
            this.router.navigate(['/courses']);
          },
          error: () => this.loading.set(false),
        });
    }
  }
}
