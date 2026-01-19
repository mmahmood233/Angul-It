import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaptchaState } from '../../services/captcha-state';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit {
  totalStages = 3;
  completedStages = 0;
  timeTaken = 0;

  constructor(
    private router: Router,
    private captchaState: CaptchaState
  ) {}

  ngOnInit(): void {
    const progress = this.captchaState.getCurrentProgress();
    
    if (!progress.isCompleted) {
      this.router.navigate(['/captcha']);
      return;
    }

    this.totalStages = progress.totalStages;
    this.completedStages = this.captchaState.getCompletedStagesCount();
    this.timeTaken = Math.floor((Date.now() - progress.startTime) / 1000);
  }

  startNewChallenge(): void {
    this.captchaState.resetProgress();
    this.captchaState.startNewChallenge();
    this.router.navigate(['/captcha']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeTaken / 60);
    const seconds = this.timeTaken % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
}
