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

      const backendMessage: string | null = error.error?.error ?? null;
      let messageKey = 'errors.unexpected';

      switch (error.status) {
        case 0:
          messageKey = 'errors.connection_error';
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
        case 400:
        case 404:
        case 500:
          if (backendMessage) {
            notification.error(backendMessage);
            return throwError(() => error);
          }
          if (error.status === 404) messageKey = 'errors.not_found';
          if (error.status === 500) messageKey = 'errors.server_error';
          break;
      }

      notification.error(translate.instant(messageKey));
      return throwError(() => error);
    }),
  );
};
