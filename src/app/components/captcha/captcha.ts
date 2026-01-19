import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { CaptchaState, CaptchaProgress } from '../../services/captcha-state';
import { Challenge, ChallengeData, ImageItem } from '../../services/challenge';

@Component({
  selector: 'app-captcha',
  imports: [CommonModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class Captcha implements OnInit, OnDestroy {
  currentStage = 1;
  totalStages = 3;
  currentChallenge?: ChallengeData;
  selectedImages: Set<string> = new Set();
  showFeedback = false;
  isCorrect = false;
  private progressSubscription?: Subscription;
  private timerSubscription?: Subscription;

  constructor(
    private router: Router,
    private captchaState: CaptchaState,
    private challengeService: Challenge,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const progress = this.captchaState.getCurrentProgress();
    this.currentStage = progress.currentStage;
    this.totalStages = progress.totalStages;
    this.loadChallenge();
  }

  ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

  private loadChallenge(): void {
    this.currentChallenge = this.challengeService.getChallengeByStage(this.currentStage);
    this.selectedImages.clear();
    this.showFeedback = false;
    this.isCorrect = false;
  }

  toggleImageSelection(imageId: string): void {
    if (this.selectedImages.has(imageId)) {
      this.selectedImages.delete(imageId);
    } else {
      this.selectedImages.add(imageId);
    }
  }

  isImageSelected(imageId: string): boolean {
    return this.selectedImages.has(imageId);
  }

  submitAnswer(): void {
    if (this.selectedImages.size === 0) {
      alert('Please select at least one image.');
      return;
    }

    const selectedArray = Array.from(this.selectedImages);
    this.isCorrect = this.challengeService.validateAnswer(this.currentStage, selectedArray);
    
    this.captchaState.submitChallengeResult(
      this.currentStage,
      selectedArray,
      this.isCorrect
    );

    this.showFeedback = true;
    this.cdr.detectChanges();

    if (this.isCorrect) {
      this.timerSubscription?.unsubscribe();
      this.timerSubscription = timer(800).subscribe(() => {
        this.showFeedback = false;
        this.nextChallenge();
        this.cdr.detectChanges();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  previousStage(): void {
    if (this.captchaState.moveToPreviousStage()) {
      this.currentStage--;
      this.loadChallenge();
    }
  }

  nextChallenge(): void {
    const hasMoreStages = this.captchaState.moveToNextStage();
    
    if (!hasMoreStages) {
      this.captchaState.completeCaptcha();
      this.router.navigate(['/result']);
    } else {
      this.currentStage++;
      this.loadChallenge();
    }
  }

  canGoBack(): boolean {
    return this.currentStage > 1;
  }

  resetFeedback(): void {
    this.showFeedback = false;
    this.selectedImages.clear();
  }
}
