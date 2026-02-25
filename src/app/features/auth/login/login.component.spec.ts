import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { CurrentUser, Role } from '../../../shared/models';

const mockUser: CurrentUser = { id: 1, name: 'Alice', email: 'a@b.com', role: Role.USER, token: 'tok' };

describe('LoginComponent', () => {
  const mockAuthService = {
    login: vi.fn().mockReturnValue(of(mockUser)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('form is invalid when empty', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component.form.invalid).toBe(true);
  });

  it('form is invalid with bad email', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ email: 'notanemail', password: '123' });
    expect(component.form.invalid).toBe(true);
  });

  it('form is valid with correct values', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('onSubmit does nothing when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('onSubmit calls AuthService.login with form values', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();
    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
  });

  it('loading resets to false on error', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();
    expect(component.loading()).toBe(false);
  });
});
