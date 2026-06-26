import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../environments/environment';

const JWT_EXEMPT_URLS = [
  '/authenticate',
  '/api/v1/users',
  '/authenticate/refresh',
  '/authenticate/logout',
  '/api/v1/applications',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  const skipJwt =
    JWT_EXEMPT_URLS.some((url) => req.url.includes(url)) && req.method === 'POST';

  let headers = req.headers;

  if (environment.apiKey) {
    headers = headers.set('X-Api-Key', environment.apiKey);
  }

  if (token && !skipJwt) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return next(req.clone({ headers }));
};
