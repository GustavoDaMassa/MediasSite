import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(StorageService);

  readonly availableLanguages = [
    { code: 'pt-BR', label: 'Português' },
    { code: 'en-US', label: 'English' },
  ];

  readonly currentLang = signal<string>(environment.defaultLang);

  constructor() {
    this.init();
  }

  init(): void {
    this.translate.addLangs(['pt-BR', 'en-US']);
    this.translate.setDefaultLang('pt-BR');
    const saved = this.storage.getLang() ?? environment.defaultLang;
    this.applyLang(saved);
  }

  switchLang(lang: string): void {
    this.applyLang(lang);
  }

  private applyLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    this.storage.setLang(lang);
  }
}
