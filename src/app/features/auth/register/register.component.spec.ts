import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Role, UserDTO } from '../../../shared/models';

const mockUserDTO: UserDTO = { id: 2, name: 'Bob', email: 'b@b.com', role: Role.USER };

describe('RegisterComponent', () => {
  const mockAuthService = {
    register: vi.fn().mockReturnValue(of(mockUserDTO)),
  };
  const mockNotification = { success: vi.fn(), error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [RegisterComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotification },
      ],
    });
  });

  it('form is invalid when empty', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });

  it('name requires minLength 2', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: 'A', email: 'valid@email.com', password: '123456' });
    expect(component.form.controls.name.hasError('minlength')).toBe(true);
  });

  it('password requires minLength 6', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: 'Alice', email: 'valid@email.com', password: '123' });
    expect(component.form.controls.password.hasError('minlength')).toBe(true);
  });

  it('form is valid with all correct values', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: 'Alice', email: 'a@a.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('onSubmit does nothing when form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.componentInstance.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('onSubmit calls AuthService.register with form values', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: 'Alice', email: 'a@a.com', password: '123456' });
    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith({ name: 'Alice', email: 'a@a.com', password: '123456' });
  });

  it('loading resets to false on error', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: 'Alice', email: 'a@a.com', password: '123456' });
    component.onSubmit();
    expect(component.loading()).toBe(false);
  });
});
