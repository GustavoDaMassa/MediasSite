import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CourseDTO, CreateCourseRequest, ProjectionDTO } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(userId: number): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.base}/api/v1/${userId}/courses`);
  }

  create(userId: number, req: CreateCourseRequest, context?: HttpContext): Observable<CourseDTO> {
    return this.http.post<CourseDTO>(`${this.base}/api/v1/${userId}/courses`, req, { context });
  }

  updateName(userId: number, courseId: number, name: string): Observable<CourseDTO> {
    return this.http.patch<CourseDTO>(`${this.base}/api/v1/${userId}/courses/${courseId}/name`, {
      string: name,
    });
  }

  updateMethod(userId: number, courseId: number, method: string, context?: HttpContext): Observable<CourseDTO> {
    return this.http.patch<CourseDTO>(
      `${this.base}/api/v1/${userId}/courses/${courseId}/method`,
      { string: method },
      { context },
    );
  }

  updateCutOff(userId: number, courseId: number, cutOff: number): Observable<CourseDTO> {
    return this.http.patch<CourseDTO>(
      `${this.base}/api/v1/${userId}/courses/${courseId}/cutoffgrade`,
      { value: cutOff },
    );
  }

  update(
    userId: number,
    courseId: number,
    changes: { name?: string; method?: string; cutOff?: number },
    context?: HttpContext,
  ): Observable<CourseDTO[]> {
    const ops: Observable<CourseDTO>[] = [];
    if (changes.name !== undefined) ops.push(this.updateName(userId, courseId, changes.name));
    if (changes.method !== undefined)
      ops.push(this.updateMethod(userId, courseId, changes.method, context));
    if (changes.cutOff !== undefined)
      ops.push(this.updateCutOff(userId, courseId, changes.cutOff));
    return forkJoin(ops);
  }

  delete(userId: number, courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/v1/${userId}/courses/${courseId}`);
  }

  listAllProjections(userId: number): Observable<ProjectionDTO[]> {
    return this.http.get<ProjectionDTO[]>(`${this.base}/api/v1/${userId}/courses/projections`);
  }
}
