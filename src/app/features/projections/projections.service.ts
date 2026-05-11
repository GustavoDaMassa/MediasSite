import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectionDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProjectionsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(courseId: number): Observable<ProjectionDTO[]> {
    return this.http.get<ProjectionDTO[]>(`${this.base}/api/v1/${courseId}/projections`);
  }

  create(courseId: number, name: string): Observable<ProjectionDTO> {
    return this.http.post<ProjectionDTO>(`${this.base}/api/v1/${courseId}/projections`, {
      string: name,
    });
  }

  updateName(courseId: number, projectionId: number, name: string): Observable<ProjectionDTO> {
    return this.http.patch<ProjectionDTO>(
      `${this.base}/api/v1/${courseId}/projections/${projectionId}`,
      { string: name },
    );
  }

  delete(courseId: number, projectionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/api/v1/${courseId}/projections/${projectionId}`,
    );
  }

  reset(courseId: number, projectionId: number): Observable<ProjectionDTO> {
    return this.http.patch<ProjectionDTO>(
      `${this.base}/api/v1/${courseId}/projections/${projectionId}/reset`,
      {},
    );
  }
}
