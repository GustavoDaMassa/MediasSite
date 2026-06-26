import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse, ProjectionDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProjectionsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(courseId: number): Observable<ProjectionDTO[]> {
    return this.http
      .get<PageResponse<ProjectionDTO>>(`${this.base}/api/v1/${courseId}/projections`)
      .pipe(map((r) => r.data));
  }

  create(courseId: number, name: string): Observable<ProjectionDTO> {
    return this.http
      .post<ApiResponse<ProjectionDTO>>(`${this.base}/api/v1/${courseId}/projections`, { string: name })
      .pipe(map((r) => r.data));
  }

  updateName(courseId: number, projectionId: number, name: string): Observable<ProjectionDTO> {
    return this.http
      .patch<ApiResponse<ProjectionDTO>>(
        `${this.base}/api/v1/${courseId}/projections/${projectionId}`,
        { string: name },
      )
      .pipe(map((r) => r.data));
  }

  delete(courseId: number, projectionId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<ProjectionDTO>>(
        `${this.base}/api/v1/${courseId}/projections/${projectionId}`,
      )
      .pipe(map(() => undefined));
  }

  reset(courseId: number, projectionId: number): Observable<ProjectionDTO> {
    return this.http
      .patch<ApiResponse<ProjectionDTO>>(
        `${this.base}/api/v1/${courseId}/projections/${projectionId}/reset`,
        {},
      )
      .pipe(map((r) => r.data));
  }
}
