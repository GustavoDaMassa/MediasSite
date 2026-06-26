import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, AssessmentDTO, PageResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AssessmentsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(projectionId: number): Observable<AssessmentDTO[]> {
    return this.http
      .get<PageResponse<AssessmentDTO>>(`${this.base}/api/v1/${projectionId}/assessments`)
      .pipe(map((r) => r.data));
  }

  updateGrade(projectionId: number, assessmentId: number, value: number): Observable<AssessmentDTO> {
    return this.http
      .patch<ApiResponse<AssessmentDTO>>(
        `${this.base}/api/v1/${projectionId}/assessments/${assessmentId}`,
        { value },
      )
      .pipe(map((r) => r.data));
  }
}
