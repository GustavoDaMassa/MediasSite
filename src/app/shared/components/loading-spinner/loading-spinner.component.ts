import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner diameter="48"></mat-spinner>`,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-xl);
    }
  `,
})
export class LoadingSpinnerComponent {}
