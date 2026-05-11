import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { ProjectionsService } from '../projections.service';
import { CoursesService } from '../../courses/courses.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AssessmentDTO, ProjectionDTO } from '../../../shared/models';

@Component({
  selector: 'app-projection-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    DecimalPipe,
    TranslatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './projection-list.component.html',
  styleUrl: './projection-list.component.scss',
})
export class ProjectionListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectionsService = inject(ProjectionsService);
  private readonly coursesService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly projections = signal<ProjectionDTO[]>([]);
  readonly courseName = signal('');
  readonly cutOffGrade = signal(6);
  readonly loading = signal(true);
  courseId = 0;

  readonly assessmentColumns = ['identifier', 'grade', 'requiredGrade', 'actions'];

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.params['courseId']);
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    const user = this.authService.currentUser();
    if (!user) return;

    forkJoin({
      projections: this.projectionsService.list(this.courseId),
      courses: this.coursesService.list(user.id),
    }).subscribe({
      next: ({ projections, courses }) => {
        this.projections.set(projections);
        const course = courses.find((c) => c.id === this.courseId);
        if (course) {
          this.courseName.set(course.name);
          this.cutOffGrade.set(course.cutOffGrade);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isGraded(assessment: AssessmentDTO): boolean {
    return assessment.requiredGrade === 0;
  }

  getFinalGradeClass(projection: ProjectionDTO): string {
    if (projection.finalGrade === 0) return '';
    return projection.finalGrade >= this.cutOffGrade() ? 'grade-ok' : 'grade-fail';
  }

  navigateToEdit(projection: ProjectionDTO): void {
    this.router.navigate(['/courses', this.courseId, 'projections', projection.id, 'edit']);
  }

  confirmDelete(projection: ProjectionDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('projections.delete_title'),
        message: this.translate.instant('projections.delete_message', {
          name: projection.name,
        }),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.projectionsService.delete(this.courseId, projection.id).subscribe({
        next: () => {
          this.projections.update((list) => list.filter((p) => p.id !== projection.id));
          this.notification.success(this.translate.instant('common.deleted'));
        },
      });
    });
  }
}
