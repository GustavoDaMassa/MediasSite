import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { CoursesService } from '../../courses/courses.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AssessmentDTO, ProjectionDTO } from '../../../shared/models';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DecimalPipe,
    TranslatePipe,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
})
export class UserOverviewComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly projections = signal<ProjectionDTO[]>([]);
  readonly courseIdMap = signal<Map<string, number>>(new Map());
  readonly cutOffMap = signal<Map<string, number>>(new Map());
  readonly formulaMap = signal<Map<string, string>>(new Map());
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    forkJoin({
      projections: this.coursesService.listAllProjections(user.id),
      courses: this.coursesService.list(user.id),
    }).subscribe({
      next: ({ projections, courses }) => {
        this.courseIdMap.set(new Map(courses.map((c) => [c.name, c.id])));
        this.cutOffMap.set(new Map(courses.map((c) => [c.name, c.cutOffGrade])));
        this.formulaMap.set(new Map(courses.map((c) => [c.name, c.averageMethod])));
        this.projections.set(
          projections
            .filter((p) => p.name === p.courseName)
            .sort((a, b) => (a.courseName ?? '').localeCompare(b.courseName ?? '')),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getCourseId(courseName: string | undefined): number {
    return this.courseIdMap().get(courseName ?? '') ?? 0;
  }

  getFormula(courseName: string | undefined): string {
    return this.formulaMap().get(courseName ?? '') ?? '';
  }

  isGraded(a: AssessmentDTO): boolean {
    return a.requiredGrade === 0;
  }

  getFinalGradeClass(grade: number, courseName: string | undefined): string {
    if (grade === 0) return '';
    const cutOff = this.cutOffMap().get(courseName ?? '') ?? 6;
    return grade >= cutOff ? 'grade-ok' : 'grade-fail';
  }

  confirmDelete(courseName: string | undefined): void {
    if (!courseName) return;
    const courseId = this.getCourseId(courseName);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('courses.delete_title'),
        message: this.translate.instant('courses.delete_message', { name: courseName }),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const user = this.authService.currentUser();
      if (!user) return;
      this.coursesService.delete(user.id, courseId).subscribe({
        next: () => {
          this.projections.update((list) => list.filter((p) => p.courseName !== courseName));
          this.notification.success(this.translate.instant('common.deleted'));
        },
      });
    });
  }

  truncate(text: string, maxLen = 50): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }
}
