import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { CoursesService } from '../../courses/courses.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssessmentDTO, ProjectionDTO } from '../../../shared/models';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    DecimalPipe,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
})
export class UserOverviewComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);

  readonly projections = signal<ProjectionDTO[]>([]);
  readonly courseIdMap = signal<Map<string, number>>(new Map());
  readonly cutOffMap = signal<Map<string, number>>(new Map());
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
        this.projections.set(
          [...projections].sort((a, b) => {
            const aAuto = a.name === a.courseName ? 0 : 1;
            const bAuto = b.name === b.courseName ? 0 : 1;
            if (aAuto !== bAuto) return aAuto - bAuto;
            return (a.courseName ?? '').localeCompare(b.courseName ?? '');
          }),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getCourseId(courseName: string | undefined): number {
    return this.courseIdMap().get(courseName ?? '') ?? 0;
  }

  isGraded(a: AssessmentDTO): boolean {
    return a.requiredGrade === 0;
  }

  getFinalGradeClass(grade: number, courseName: string | undefined): string {
    if (grade === 0) return '';
    const cutOff = this.cutOffMap().get(courseName ?? '') ?? 6;
    return grade >= cutOff ? 'grade-ok' : 'grade-fail';
  }
}
