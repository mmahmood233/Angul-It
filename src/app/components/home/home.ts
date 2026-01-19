import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CaptchaState } from '../../services/captcha-state';
import { Challenge } from '../../services/challenge';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private router: Router,
    private captchaState: CaptchaState,
    private challengeService: Challenge
  ) {}

  startCaptcha(): void {
    this.challengeService.generateRandomChallenges();
    this.captchaState.startNewChallenge();
    this.router.navigate(['/captcha']);
  }
}
