import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const token = userService.getToken();

  if (!token) {
    return next(req);
  }

  if (/^https?:\/\//i.test(req.url)) {
    try {
      const destination = new URL(req.url);
      if (typeof window !== 'undefined' && destination.origin !== window.location.origin) {
        return next(req);
      }
    } catch {
      return next(req);
    }
  }

  const authorized = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authorized);
};