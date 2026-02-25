import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Role } from '../../shared/models';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    storage = TestBed.inject(StorageService);
  });

  afterEach(() => http.verify());

  it('isAuthenticated returns false without token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns true with token in storage', () => {
    storage.setToken('tok');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('restoreSession populates currentUser when all data is in storage', () => {
    storage.setToken('tok');
    storage.setUserId(1);
    storage.setEmail('a@b.com');
    storage.setName('Alice');
    storage.setRole(Role.USER);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const svc = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    expect(svc.currentUser()).toEqual({ id: 1, email: 'a@b.com', name: 'Alice', role: Role.USER, token: 'tok' });
  });

  it('login stores token and sets currentUser', () => {
    const mockUser = { id: 1, name: 'Alice', email: 'a@b.com', role: Role.USER };
    let emitted = false;

    service.login({ email: 'a@b.com', password: '123456' }).subscribe(() => (emitted = true));

    http.expectOne((req) => req.url.includes('/authenticate')).flush('jwt-token', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/plain' },
    });
    http.expectOne((req) => req.url.includes('/api/v1/users/')).flush(mockUser);

    expect(emitted).toBe(true);
    expect(storage.getToken()).toBe('jwt-token');
  });

  it('register sends POST to /api/v1/users', () => {
    let done = false;
    service.register({ name: 'Bob', email: 'b@b.com', password: 'pass' }).subscribe(() => (done = true));
    const req = http.expectOne((r) => r.url.includes('/api/v1/users') && r.method === 'POST');
    req.flush({ id: 2, name: 'Bob', email: 'b@b.com', role: Role.USER });
    expect(done).toBe(true);
  });

  it('logout clears storage and resets currentUser', () => {
    storage.setToken('tok');
    storage.setUserId(1);
    storage.setEmail('a@b.com');
    storage.setName('Alice');
    storage.setRole(Role.USER);
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
