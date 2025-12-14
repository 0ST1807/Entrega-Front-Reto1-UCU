import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);

  if (userService.isLoggedIn()) {
    return true;
  }

  const router = inject(Router);
  return router.createUrlTree(['login']);
};