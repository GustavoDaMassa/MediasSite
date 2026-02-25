import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CourseListComponent } from './course-list.component';
import { CoursesService } from '../courses.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CourseDTO, Role } from '../../../shared/models';

const mockCourses: CourseDTO[] = [
  { id: 1, name: 'Matemática', averageMethod: 'AV1', cutOffGrade: 6 },
  { id: 2, name: 'Física', averageMethod: 'AV2', cutOffGrade: 5 },
];

const mockCurrentUser = { id: 1, name: 'Alice', email: 'a@b.com', role: Role.USER, token: 'tok' };

describe('CourseListComponent', () => {
  const mockCoursesService = {
    list: vi.fn().mockReturnValue(of(mockCourses)),
    delete: vi.fn().mockReturnValue(of(undefined)),
  };
  const mockAuthService = {
    currentUser: signal(mockCurrentUser),
    isAuthenticated: vi.fn().mockReturnValue(true),
  };
  const mockNotification = { success: vi.fn() };
  const mockDialog = {
    open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCoursesService.list.mockReturnValue(of(mockCourses));
    TestBed.configureTestingModule({
      imports: [CourseListComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotification },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });
  });

  it('loads courses on init', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    expect(mockCoursesService.list).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.courses()).toEqual(mockCourses);
  });

  it('loading becomes false after courses are loaded', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('courses signal is empty initially when no courses returned', () => {
    mockCoursesService.list.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.courses()).toEqual([]);
  });

  it('confirmDelete calls dialog.open and removes course on confirm', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.confirmDelete(mockCourses[0]);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockCoursesService.delete).toHaveBeenCalledWith(1, 1);
    expect(component.courses().find((c) => c.id === 1)).toBeUndefined();
  });

  it('truncate shortens text longer than maxLen', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    const component = fixture.componentInstance;
    const longText = 'A'.repeat(50);
    expect(component.truncate(longText, 10)).toBe('A'.repeat(10) + '…');
  });
});
