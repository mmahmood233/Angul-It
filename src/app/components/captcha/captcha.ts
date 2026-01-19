import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CaptchaState, CaptchaProgress } from '../../services/captcha-state';

@Component({
  selector: 'app-captcha',
  imports: [CommonModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class Captcha implements OnInit, OnDestroy {
  currentStage = 1;
  totalStages = 3;
  private progressSubscription?: Subscription;

  constructor(
    private router: Router,
    private captchaState: CaptchaState
  ) {}

  ngOnInit(): void {
    this.progressSubscription = this.captchaState.progress$.subscribe(
      (progress: CaptchaProgress) => {
        this.currentStage = progress.currentStage;
        this.totalStages = progress.totalStages;
      }
    );
  }

  ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  previousStage(): void {
    this.captchaState.moveToPreviousStage();
  }

  nextChallenge(): void {
    const canProceed = this.captchaState.canProceedToNextStage();
    
    if (!canProceed) {
      alert('Please complete the current challenge before proceeding.');
      return;
    }

    const hasMoreStages = this.captchaState.moveToNextStage();
    
    if (!hasMoreStages) {
      this.captchaState.completeCaptcha();
      this.router.navigate(['/result']);
    }
  }

  canGoBack(): boolean {
    return this.currentStage > 1;
  }
}
