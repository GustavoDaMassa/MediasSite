import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-formula-help-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ 'courses.formula_help_title' | translate }}</h2>
    <mat-dialog-content class="help-dialog">
      <p class="help-intro">{{ 'courses.formula_help_intro' | translate }}</p>

      <section class="help-section">
        <h3>{{ 'courses.formula_help_identifiers_title' | translate }}</h3>
        <p>{{ 'courses.formula_help_identifiers_body' | translate }}</p>
        <div class="code-block"><code>AV1, AV2, AT1, AT2, P1, P2...</code></div>
      </section>

      <section class="help-section">
        <h3>{{ 'courses.formula_help_ops_title' | translate }}</h3>
        <p>{{ 'courses.formula_help_ops_body' | translate }}</p>
        <div class="code-block"><code>(AV1 + AV2) / 2</code></div>
        <div class="code-block"><code>(0.4 * AV1) + (0.6 * AV2)</code></div>
        <div class="code-block"><code>(P1 + P2 + P3) / 3</code></div>
      </section>

      <section class="help-section">
        <h3>{{ 'courses.formula_help_maxgrade_title' | translate }}</h3>
        <p>{{ 'courses.formula_help_maxgrade_body' | translate }}</p>
        <div class="code-block"><code>AV1[15]</code></div>
        <div class="code-block"><code>(AV1[20] + AV2[20]) / 2</code></div>
      </section>

      <section class="help-section">
        <h3>{{ 'courses.formula_help_topn_title' | translate }}</h3>
        <p>{{ 'courses.formula_help_topn_body' | translate }}</p>
        <div class="code-block"><code>@M[2](AT1;AT2;AT3) / 2</code></div>
        <div class="code-block"><code>@M[3](AT1;AT2;AT3;AT4) / 3</code></div>
      </section>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.close' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .help-dialog {
      max-width: 520px;
      padding: 4px 4px 8px;
    }
    .help-intro {
      color: var(--color-text-secondary);
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 1.5;
    }
    .help-section {
      margin-bottom: 20px;
    }
    .help-section h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-primary);
      margin: 0 0 6px;
    }
    .help-section p {
      font-size: 13px;
      color: var(--color-text-secondary);
      margin: 0 0 8px;
      line-height: 1.5;
    }
    .code-block {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 6px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
      font-size: 13px;
      color: var(--color-text-primary);
    }
  `],
})
export class FormulaHelpDialogComponent {}
