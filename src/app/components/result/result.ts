import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {
  totalStages = 3;

  constructor(private router: Router) {}

  startNewChallenge(): void {
    this.router.navigate(['/captcha']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
