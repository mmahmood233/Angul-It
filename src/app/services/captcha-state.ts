import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChallengeResult {
  stage: number;
  completed: boolean;
  answer: string[];
  timestamp: number;
}

export interface CaptchaProgress {
  currentStage: number;
  totalStages: number;
  results: ChallengeResult[];
  isCompleted: boolean;
  startTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class CaptchaState {
  private readonly STORAGE_KEY = 'angul-it-captcha-progress';
  private readonly TOTAL_STAGES = 3;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser: boolean;

  private progressSubject: BehaviorSubject<CaptchaProgress>;
  public progress$: Observable<CaptchaProgress>;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    const savedProgress = this.loadProgress();
    this.progressSubject = new BehaviorSubject<CaptchaProgress>(savedProgress);
    this.progress$ = this.progressSubject.asObservable();
  }

  private loadProgress(): CaptchaProgress {
    if (!this.isBrowser) {
      return this.createInitialProgress();
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return this.createInitialProgress();
  }

  private createInitialProgress(): CaptchaProgress {
    return {
      currentStage: 1,
      totalStages: this.TOTAL_STAGES,
      results: [],
      isCompleted: false,
      startTime: Date.now(),
    };
  }

  private saveProgress(progress: CaptchaProgress): void {
    if (!this.isBrowser) {
      this.progressSubject.next(progress);
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      this.progressSubject.next(progress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getCurrentProgress(): CaptchaProgress {
    return this.progressSubject.value;
  }

  startNewChallenge(): void {
    const newProgress = this.createInitialProgress();
    this.saveProgress(newProgress);
  }

  submitChallengeResult(stage: number, answer: string[], isCorrect: boolean): void {
    const currentProgress = this.getCurrentProgress();
    
    const result: ChallengeResult = {
      stage,
      completed: isCorrect,
      answer,
      timestamp: Date.now(),
    };

    const updatedResults = [...currentProgress.results];
    const existingIndex = updatedResults.findIndex(r => r.stage === stage);
    
    if (existingIndex >= 0) {
      updatedResults[existingIndex] = result;
    } else {
      updatedResults.push(result);
    }

    const updatedProgress: CaptchaProgress = {
      ...currentProgress,
      results: updatedResults,
    };

    this.saveProgress(updatedProgress);
  }

  moveToNextStage(): boolean {
    const currentProgress = this.getCurrentProgress();
    
    if (currentProgress.currentStage < this.TOTAL_STAGES) {
      const updatedProgress: CaptchaProgress = {
        ...currentProgress,
        currentStage: currentProgress.currentStage + 1,
      };
      this.saveProgress(updatedProgress);
      return true;
    }
    
    return false;
  }

  moveToPreviousStage(): boolean {
    const currentProgress = this.getCurrentProgress();
    
    if (currentProgress.currentStage > 1) {
      const updatedProgress: CaptchaProgress = {
        ...currentProgress,
        currentStage: currentProgress.currentStage - 1,
      };
      this.saveProgress(updatedProgress);
      return true;
    }
    
    return false;
  }

  completeCaptcha(): void {
    const currentProgress = this.getCurrentProgress();
    const updatedProgress: CaptchaProgress = {
      ...currentProgress,
      isCompleted: true,
    };
    this.saveProgress(updatedProgress);
  }

  resetProgress(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    const newProgress = this.createInitialProgress();
    this.progressSubject.next(newProgress);
  }

  isStageCompleted(stage: number): boolean {
    const currentProgress = this.getCurrentProgress();
    const result = currentProgress.results.find(r => r.stage === stage);
    return result?.completed || false;
  }

  getCompletedStagesCount(): number {
    const currentProgress = this.getCurrentProgress();
    return currentProgress.results.filter(r => r.completed).length;
  }

  canProceedToNextStage(): boolean {
    const currentProgress = this.getCurrentProgress();
    return this.isStageCompleted(currentProgress.currentStage);
  }
}
