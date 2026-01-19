import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { CaptchaState, CaptchaProgress } from '../../services/captcha-state';
import { Challenge, ChallengeData, ImageItem } from '../../services/challenge';

@Component({
  selector: 'app-captcha',
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class Captcha implements OnInit, OnDestroy {
  currentStage = 1;
  totalStages = 3;
  currentChallenge?: ChallengeData;
  selectedImages: Set<string> = new Set();
  userInput: string = '';
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
    this.userInput = '';
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
    let answerArray: string[];

    if (this.currentChallenge?.type === 'select-multiple') {
      if (this.selectedImages.size === 0) {
        alert('Please select at least one image.');
        return;
      }
      answerArray = Array.from(this.selectedImages);
    } else {
      const answer = String(this.userInput).trim();
      if (!answer) {
        alert('Please provide an answer.');
        return;
      }
      answerArray = [answer];
    }

    this.isCorrect = this.challengeService.validateAnswer(this.currentStage, answerArray);
    
    this.captchaState.submitChallengeResult(
      this.currentStage,
      answerArray,
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
    this.userInput = '';
  }
}
