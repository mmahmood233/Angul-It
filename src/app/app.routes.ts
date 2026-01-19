import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { completionGuard } from './guards/completion-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'captcha', component: Captcha },
  { path: 'result', component: Result, canActivate: [completionGuard] },
  { path: '**', redirectTo: '/home' }
];
