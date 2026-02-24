import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { CoursesService } from '../../courses/courses.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssessmentDTO, ProjectionDTO } from '../../../shared/models';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [
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
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.coursesService.listAllProjections(user.id).subscribe({
      next: (projections) => {
        this.projections.set(projections);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isGraded(a: AssessmentDTO): boolean {
    return a.requiredGrade === 0;
  }

  getFinalGradeClass(grade: number): string {
    if (grade === 0) return '';
    return grade >= 6 ? 'grade-ok' : 'grade-fail';
  }
}
