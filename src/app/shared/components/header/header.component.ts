import { computed, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly i18nService = inject(I18nService);

  readonly isAuthenticated = () => this.authService.isAuthenticated();
  readonly currentUser = this.authService.currentUser;

  readonly userInitials = computed(() => {
    const name = this.currentUser()?.name ?? '';
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  readonly currentTheme = this.themeService.currentTheme;
  readonly themeIcon = computed(() =>
    this.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode',
  );
  readonly themeTooltipKey = computed(() =>
    this.currentTheme() === 'dark' ? 'theme.toggle_light' : 'theme.toggle_dark',
  );

  readonly currentLang = this.i18nService.currentLang;
  readonly currentLangLabel = computed(() => (this.currentLang() === 'pt-BR' ? 'PT' : 'EN'));

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLang(): void {
    const next = this.currentLang() === 'pt-BR' ? 'en-US' : 'pt-BR';
    this.i18nService.switchLang(next);
  }

  logout(): void {
    this.authService.logout();
  }
}
