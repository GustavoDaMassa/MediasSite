import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon() }}</mat-icon>
      <p class="empty-state__message">{{ message() }}</p>
      @if (subtitle()) {
        <p class="empty-state__subtitle">{{ subtitle() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-2xl);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-lg);
      text-align: center;

      mat-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        color: var(--color-text-muted);
        opacity: 0.6;
      }
    }

    .empty-state__message {
      color: var(--color-text-secondary);
      margin: 0;
      font-size: var(--font-sm);
      font-weight: 500;
    }

    .empty-state__subtitle {
      color: var(--color-text-muted);
      margin: 0;
      font-size: var(--font-xs);
    }
  `,
})
export class EmptyStateComponent {
  message = input.required<string>();
  icon = input<string>('inbox');
  subtitle = input<string>();
}
