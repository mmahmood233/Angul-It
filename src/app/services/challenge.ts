import { Injectable } from '@angular/core';

export interface ImageItem {
  id: string;
  emoji: string;
  label: string;
}

export interface ChallengeData {
  stage: number;
  question: string;
  images: ImageItem[];
  correctAnswers: string[];
  type: 'select-multiple' | 'select-single';
}

@Injectable({
  providedIn: 'root',
})
export class Challenge {
  private challenges: ChallengeData[] = [
    {
      stage: 1,
      question: 'Select all images containing ANIMALS',
      type: 'select-multiple',
      images: [
        { id: '1', emoji: '🐕', label: 'Dog' },
        { id: '2', emoji: '🚗', label: 'Car' },
        { id: '3', emoji: '🐈', label: 'Cat' },
        { id: '4', emoji: '🏠', label: 'House' },
        { id: '5', emoji: '🦁', label: 'Lion' },
        { id: '6', emoji: '⚽', label: 'Ball' },
        { id: '7', emoji: '🐘', label: 'Elephant' },
        { id: '8', emoji: '🌳', label: 'Tree' },
        { id: '9', emoji: '🐦', label: 'Bird' },
      ],
      correctAnswers: ['1', '3', '5', '7', '9'],
    },
    {
      stage: 2,
      question: 'Select all images containing VEHICLES',
      type: 'select-multiple',
      images: [
        { id: '1', emoji: '🚗', label: 'Car' },
        { id: '2', emoji: '🍎', label: 'Apple' },
        { id: '3', emoji: '✈️', label: 'Plane' },
        { id: '4', emoji: '🌸', label: 'Flower' },
        { id: '5', emoji: '🚲', label: 'Bike' },
        { id: '6', emoji: '📱', label: 'Phone' },
        { id: '7', emoji: '🚢', label: 'Ship' },
        { id: '8', emoji: '🎨', label: 'Art' },
        { id: '9', emoji: '🚁', label: 'Helicopter' },
      ],
      correctAnswers: ['1', '3', '5', '7', '9'],
    },
    {
      stage: 3,
      question: 'Select all images containing FOOD',
      type: 'select-multiple',
      images: [
        { id: '1', emoji: '🍕', label: 'Pizza' },
        { id: '2', emoji: '⚽', label: 'Ball' },
        { id: '3', emoji: '🍔', label: 'Burger' },
        { id: '4', emoji: '💻', label: 'Laptop' },
        { id: '5', emoji: '🍎', label: 'Apple' },
        { id: '6', emoji: '🎮', label: 'Game' },
        { id: '7', emoji: '🍰', label: 'Cake' },
        { id: '8', emoji: '📚', label: 'Books' },
        { id: '9', emoji: '🍦', label: 'Ice Cream' },
      ],
      correctAnswers: ['1', '3', '5', '7', '9'],
    },
  ];

  getChallengeByStage(stage: number): ChallengeData | undefined {
    return this.challenges.find(c => c.stage === stage);
  }

  validateAnswer(stage: number, selectedIds: string[]): boolean {
    const challenge = this.getChallengeByStage(stage);
    if (!challenge) return false;

    const sortedSelected = [...selectedIds].sort();
    const sortedCorrect = [...challenge.correctAnswers].sort();

    if (sortedSelected.length !== sortedCorrect.length) return false;

    return sortedSelected.every((id, index) => id === sortedCorrect[index]);
  }

  getAllChallenges(): ChallengeData[] {
    return this.challenges;
  }
}
