import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectionListComponent } from './projection-list.component';
import { ProjectionsService } from '../projections.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectionDTO } from '../../../shared/models';
import { CoursesService } from '../../courses/courses.service';
import { AuthService } from '../../../core/services/auth.service';

const mockProjections: ProjectionDTO[] = [
  { id: 1, name: 'Cenário A', assessment: [], finalGrade: 7.5 },
  { id: 2, name: 'Cenário B', assessment: [], finalGrade: 5.0 },
];

describe('ProjectionListComponent', () => {
  const mockProjectionsService = {
    list: vi.fn().mockReturnValue(of(mockProjections)),
    delete: vi.fn().mockReturnValue(of(undefined)),
  };
  const mockCoursesService = {
    list: vi.fn().mockReturnValue(of([{ id: 10, name: 'Math', cutOffGrade: 6 }])),
  };
  const mockAuthService = {
    currentUser: vi.fn().mockReturnValue({ id: 1 }),
  };
  const mockNotification = { success: vi.fn() };
  const mockDialog = {
    open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
  };
  const mockRoute = {
    snapshot: { params: { courseId: '10' } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectionsService.list.mockReturnValue(of(mockProjections));
    TestBed.configureTestingModule({
      imports: [ProjectionListComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: ProjectionsService, useValue: mockProjectionsService },
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotification },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    });
  });

  it('loads projections on init with correct courseId', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    fixture.detectChanges();
    expect(mockProjectionsService.list).toHaveBeenCalledWith(10);
    expect(fixture.componentInstance.projections()).toEqual(mockProjections);
  });

  it('loading becomes false after projections are loaded', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('projections signal is empty when none returned', () => {
    mockProjectionsService.list.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(ProjectionListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.projections()).toEqual([]);
  });

  it('confirmDelete opens dialog and removes projection on confirm', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.confirmDelete(mockProjections[0]);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockProjectionsService.delete).toHaveBeenCalledWith(10, 1);
    expect(component.projections().find((p) => p.id === 1)).toBeUndefined();
  });

  it('navigateToEdit navigates to edit route', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance.navigateToEdit(mockProjections[0]);
    expect(navSpy).toHaveBeenCalledWith(['/courses', 10, 'projections', 1, 'edit']);
  });

  it('getFinalGradeClass returns grade-ok when >= 6', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    const component = fixture.componentInstance;
    expect(component.getFinalGradeClass(mockProjections[0])).toBe('grade-ok');
  });

  it('getFinalGradeClass returns grade-fail when < 6', () => {
    const fixture = TestBed.createComponent(ProjectionListComponent);
    const component = fixture.componentInstance;
    expect(component.getFinalGradeClass(mockProjections[1])).toBe('grade-fail');
  });
});
