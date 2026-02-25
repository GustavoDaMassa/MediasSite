import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectionsService } from './projections.service';
import { ProjectionDTO } from '../../shared/models';

const mockProjection: ProjectionDTO = {
  id: 1,
  name: 'Cenário A',
  assessment: [],
  finalGrade: 0,
};

describe('ProjectionsService', () => {
  let service: ProjectionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectionsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list sends GET to /api/v1/{courseId}/projections', () => {
    let result: ProjectionDTO[] | undefined;
    service.list(10).subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.includes('/api/v1/10/projections') && r.method === 'GET');
    req.flush([mockProjection]);
    expect(result).toEqual([mockProjection]);
  });

  it('create sends POST to /api/v1/{courseId}/projections', () => {
    let result: ProjectionDTO | undefined;
    service.create(10, 'Cenário B').subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.includes('/api/v1/10/projections') && r.method === 'POST');
    expect(req.request.body).toEqual({ string: 'Cenário B' });
    req.flush(mockProjection);
    expect(result).toEqual(mockProjection);
  });

  it('updateName sends PATCH with { string: name }', () => {
    let result: ProjectionDTO | undefined;
    service.updateName(10, 1, 'Novo Nome').subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url.includes('/projections/1') && r.method === 'PATCH');
    expect(req.request.body).toEqual({ string: 'Novo Nome' });
    req.flush({ ...mockProjection, name: 'Novo Nome' });
    expect(result?.name).toBe('Novo Nome');
  });

  it('delete sends DELETE to /api/v1/{courseId}/projections/{id}', () => {
    let called = false;
    service.delete(10, 1).subscribe(() => (called = true));
    const req = http.expectOne((r) => r.method === 'DELETE' && r.url.includes('/projections/1'));
    req.flush(null);
    expect(called).toBe(true);
  });
});
