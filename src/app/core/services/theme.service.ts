import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly currentTheme = signal<'light' | 'dark'>('dark');

  constructor() {
    this.loadTheme();
  }

  toggle(): void {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  private loadTheme(): void {
    const saved = this.storage.getTheme() as 'light' | 'dark' | null;
    if (saved) {
      this.applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.storage.setTheme(theme);
  }
}
