import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CoursesService } from './courses.service';
import { CourseDTO } from '../../shared/models';

const mockCourse: CourseDTO = {
  id: 1,
  name: 'Matemática',
  averageMethod: 'AV1',
  cutOffGrade: 6,
};

describe('CoursesService', () => {
  let service: CoursesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CoursesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list sends GET to /api/v1/{userId}/courses', () => {
    let result: CourseDTO[] | undefined;
    service.list(1).subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.includes('/api/v1/1/courses') && r.method === 'GET');
    req.flush([mockCourse]);
    expect(result).toEqual([mockCourse]);
  });

  it('create sends POST to /api/v1/{userId}/courses', () => {
    let result: CourseDTO | undefined;
    service.create(1, { name: 'Física', averageMethod: 'AV1', cutOffGrade: 6 }).subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.includes('/api/v1/1/courses') && r.method === 'POST');
    req.flush(mockCourse);
    expect(result).toEqual(mockCourse);
  });

  it('update sends forkJoin of PATCH requests', () => {
    let called = false;
    service.update(1, 1, { name: 'Nova', cutOff: 7 }).subscribe(() => (called = true));
    const nameReq = http.expectOne((r) => r.url.includes('/name') && r.method === 'PATCH');
    const cutoffReq = http.expectOne((r) => r.url.includes('/cutoffgrade') && r.method === 'PATCH');
    nameReq.flush(mockCourse);
    cutoffReq.flush(mockCourse);
    expect(called).toBe(true);
  });

  it('delete sends DELETE to /api/v1/{userId}/courses/{courseId}', () => {
    let called = false;
    service.delete(1, 1).subscribe(() => (called = true));
    const req = http.expectOne((r) => r.method === 'DELETE' && r.url.includes('/courses/1'));
    req.flush(null);
    expect(called).toBe(true);
  });
});
