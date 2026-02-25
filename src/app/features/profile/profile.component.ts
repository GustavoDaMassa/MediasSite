import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserService } from './user.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    TranslatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly userService = inject(UserService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly loadingName = signal(false);
  readonly loadingEmail = signal(false);
  readonly loadingDelete = signal(false);

  readonly nameForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.nameForm.patchValue({ name: user.name });
      this.emailForm.patchValue({ email: user.email });
    }
  }

  updateName(): void {
    if (this.nameForm.invalid) return;
    const user = this.authService.currentUser();
    if (!user) return;
    this.loadingName.set(true);
    const { name } = this.nameForm.getRawValue();
    this.userService.updateName(user.id, name).subscribe({
      next: (updated) => {
        this.authService.currentUser.update((u) => (u ? { ...u, name: updated.name } : u));
        this.storage.setName(updated.name);
        this.notification.success(this.translate.instant('common.updated'));
        this.loadingName.set(false);
      },
      error: () => this.loadingName.set(false),
    });
  }

  updateEmail(): void {
    if (this.emailForm.invalid) return;
    const user = this.authService.currentUser();
    if (!user) return;
    this.loadingEmail.set(true);
    const { email } = this.emailForm.getRawValue();
    this.userService.updateEmail(user.id, email).subscribe({
      next: (updated) => {
        this.authService.currentUser.update((u) => (u ? { ...u, email: updated.email } : u));
        this.storage.setEmail(updated.email);
        this.notification.success(this.translate.instant('common.updated'));
        this.loadingEmail.set(false);
      },
      error: () => this.loadingEmail.set(false),
    });
  }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('profile.delete_title'),
        message: this.translate.instant('profile.delete_message'),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const user = this.authService.currentUser();
      if (!user) return;
      this.loadingDelete.set(true);
      this.userService.delete(user.id).subscribe({
        next: () => this.authService.logout(),
        error: () => this.loadingDelete.set(false),
      });
    });
  }
}
