import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { CaoTokenGuardService } from "src/public-api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const tokenService = inject(CaoTokenGuardService);

  // Verificar se há token usando o TokenService
  const isAuthenticated = tokenService.hasToken();

  if (isAuthenticated) {
    return true;
  } else {
    // Redirect to the login page if not authenticated
    return router.parseUrl("/login");
  }
};
