import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

const PUBLIC_URLS = ['/authenticate', '/api/v1/users'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  const isPublic =
    PUBLIC_URLS.some((url) => req.url.endsWith(url)) && req.method === 'POST';

  if (token && !isPublic) {
    return next(
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      }),
    );
  }

  return next(req);
};
