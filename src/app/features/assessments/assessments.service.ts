import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssessmentDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AssessmentsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(projectionId: number): Observable<AssessmentDTO[]> {
    return this.http.get<AssessmentDTO[]>(
      `${this.base}/api/v1/${projectionId}/assessments`,
    );
  }

  updateGrade(
    projectionId: number,
    assessmentId: number,
    value: number,
  ): Observable<AssessmentDTO> {
    return this.http.patch<AssessmentDTO>(
      `${this.base}/api/v1/${projectionId}/assessments/${assessmentId}`,
      { value },
    );
  }
}
