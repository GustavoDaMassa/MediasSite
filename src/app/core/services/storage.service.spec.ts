import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should set and get token', () => {
    service.setToken('abc');
    expect(service.getToken()).toBe('abc');
  });

  it('hasToken returns false when no token', () => {
    expect(service.hasToken()).toBe(false);
  });

  it('hasToken returns true after setToken', () => {
    service.setToken('tok');
    expect(service.hasToken()).toBe(true);
  });

  it('should set and get userId', () => {
    service.setUserId(42);
    expect(service.getUserId()).toBe(42);
  });

  it('getUserId returns null when not set', () => {
    expect(service.getUserId()).toBeNull();
  });

  it('should set and get email', () => {
    service.setEmail('test@example.com');
    expect(service.getEmail()).toBe('test@example.com');
  });

  it('should set and get name', () => {
    service.setName('John Doe');
    expect(service.getName()).toBe('John Doe');
  });

  it('should set and get role', () => {
    service.setRole('STUDENT');
    expect(service.getRole()).toBe('STUDENT');
  });

  it('should set and get theme', () => {
    service.setTheme('dark');
    expect(service.getTheme()).toBe('dark');
  });

  it('should set and get lang', () => {
    service.setLang('pt-BR');
    expect(service.getLang()).toBe('pt-BR');
  });

  it('clearAuth removes token, userId, email, name and role', () => {
    service.setToken('tok');
    service.setUserId(1);
    service.setEmail('e@e.com');
    service.setName('Name');
    service.setRole('STUDENT');
    service.clearAuth();
    expect(service.getToken()).toBeNull();
    expect(service.getUserId()).toBeNull();
    expect(service.getEmail()).toBeNull();
    expect(service.getName()).toBeNull();
    expect(service.getRole()).toBeNull();
  });

  it('clearAuth does not remove theme and lang', () => {
    service.setTheme('dark');
    service.setLang('pt-BR');
    service.clearAuth();
    expect(service.getTheme()).toBe('dark');
    expect(service.getLang()).toBe('pt-BR');
  });
});
