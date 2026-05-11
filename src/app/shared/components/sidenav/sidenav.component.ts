import { Component, computed, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatDividerModule, TranslatePipe],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly i18nService = inject(I18nService);

  readonly close = output<void>();
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = () => this.authService.isAuthenticated();

  readonly userInitials = computed(() => {
    const name = this.currentUser()?.name ?? '';
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  });

  readonly currentTheme = this.themeService.currentTheme;
  readonly themeIcon = computed(() =>
    this.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode',
  );
  readonly themeLabel = computed(() =>
    this.currentTheme() === 'dark' ? 'theme.toggle_light' : 'theme.toggle_dark',
  );

  readonly currentLang = this.i18nService.currentLang;
  readonly currentLangLabel = computed(() => (this.currentLang() === 'pt-BR' ? 'PT' : 'EN'));
  readonly nextLangLabel = computed(() => (this.currentLang() === 'pt-BR' ? 'English' : 'Português'));

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLang(): void {
    const next = this.currentLang() === 'pt-BR' ? 'en-US' : 'pt-BR';
    this.i18nService.switchLang(next);
  }

  logout(): void {
    this.close.emit();
    this.authService.logout();
  }
}
