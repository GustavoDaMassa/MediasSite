import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const notification = injector.get(NotificationService);
      const translate = injector.get(TranslateService);
      const auth = injector.get(AuthService);

      let messageKey = 'errors.unexpected';
      let rawMessage: string | null = null;

      switch (error.status) {
        case 0:
          messageKey = 'errors.connection_error';
          break;
        case 400:
          rawMessage = error.error?.error ?? null;
          break;
        case 401:
          if (auth.isAuthenticated()) {
            auth.logout();
            messageKey = 'errors.session_expired';
          }
          break;
        case 403:
          messageKey = 'errors.no_permission';
          break;
        case 404:
          messageKey = 'errors.not_found';
          break;
        case 500:
          messageKey = 'errors.server_error';
          break;
      }

      const message = rawMessage ?? translate.instant(messageKey);
      notification.error(message);
      return throwError(() => error);
    }),
  );
};
