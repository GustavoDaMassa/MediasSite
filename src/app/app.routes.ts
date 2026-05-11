import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'courses/new',
    loadComponent: () =>
      import('./features/courses/course-form/course-form.component').then(
        (m) => m.CourseFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/edit',
    loadComponent: () =>
      import('./features/courses/course-form/course-form.component').then(
        (m) => m.CourseFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/projections',
    loadComponent: () =>
      import('./features/projections/projection-list/projection-list.component').then(
        (m) => m.ProjectionListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/projections/new',
    loadComponent: () =>
      import('./features/projections/projection-form/projection-form.component').then(
        (m) => m.ProjectionFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/projections/:projectionId/edit',
    loadComponent: () =>
      import('./features/projections/projection-form/projection-form.component').then(
        (m) => m.ProjectionFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'courses/:courseId/projections/:projectionId/assessments/:assessmentId/grade',
    loadComponent: () =>
      import('./features/assessments/assessment-grade/assessment-grade.component').then(
        (m) => m.AssessmentGradeComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./features/overview/user-overview/user-overview.component').then(
        (m) => m.UserOverviewComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
