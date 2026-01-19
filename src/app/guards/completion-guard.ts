import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaState } from '../services/captcha-state';

export const completionGuard: CanActivateFn = (route, state) => {
  const captchaState = inject(CaptchaState);
  const router = inject(Router);

  const progress = captchaState.getCurrentProgress();

  if (progress.isCompleted) {
    return true;
  }

  router.navigate(['/captcha']);
  return false;
};
