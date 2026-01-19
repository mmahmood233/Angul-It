import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-captcha',
  imports: [],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class Captcha {
  currentStage = 1;
  totalStages = 3;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  nextChallenge(): void {
    if (this.currentStage < this.totalStages) {
      this.currentStage++;
    } else {
      this.router.navigate(['/result']);
    }
  }
}
