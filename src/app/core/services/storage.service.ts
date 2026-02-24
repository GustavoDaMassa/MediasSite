import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly EMAIL_KEY = 'user_email';
  private readonly NAME_KEY = 'user_name';
  private readonly ROLE_KEY = 'user_role';
  private readonly THEME_KEY = 'theme';
  private readonly LANG_KEY = 'lang';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setUserId(id: number): void {
    localStorage.setItem(this.USER_ID_KEY, String(id));
  }

  getUserId(): number | null {
    const v = localStorage.getItem(this.USER_ID_KEY);
    return v ? Number(v) : null;
  }

  setEmail(email: string): void {
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  setName(name: string): void {
    localStorage.setItem(this.NAME_KEY, name);
  }

  getName(): string | null {
    return localStorage.getItem(this.NAME_KEY);
  }

  setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  setTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  setLang(lang: string): void {
    localStorage.setItem(this.LANG_KEY, lang);
  }

  getLang(): string | null {
    return localStorage.getItem(this.LANG_KEY);
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.NAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
