import { Injectable } from '@angular/core';

export interface ImageItem {
  id: string;
  emoji: string;
  label: string;
}

export interface ChallengeData {
  stage: number;
  question: string;
  images?: ImageItem[];
  correctAnswers: string[];
  type: 'select-multiple' | 'math' | 'text-input';
  mathProblem?: string;
  textPrompt?: string;
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
      question: 'Solve the math problem',
      type: 'math',
      mathProblem: 'What is 7 + 5?',
      correctAnswers: ['12'],
    },
    {
      stage: 3,
      question: 'Type the word shown below',
      type: 'text-input',
      textPrompt: 'HUMAN',
      correctAnswers: ['HUMAN', 'human'],
    },
  ];

  getChallengeByStage(stage: number): ChallengeData | undefined {
    return this.challenges.find(c => c.stage === stage);
  }

  validateAnswer(stage: number, selectedIds: string[]): boolean {
    const challenge = this.getChallengeByStage(stage);
    if (!challenge) return false;

    // For text/math challenges with single answer
    if (challenge.type === 'math' || challenge.type === 'text-input') {
      return selectedIds.length === 1 && challenge.correctAnswers.includes(selectedIds[0]);
    }

    // For multi-select image challenges
    const sortedSelected = [...selectedIds].sort();
    const sortedCorrect = [...challenge.correctAnswers].sort();

    if (sortedSelected.length !== sortedCorrect.length) return false;

    return sortedSelected.every((id, index) => id === sortedCorrect[index]);
  }

  getAllChallenges(): ChallengeData[] {
    return this.challenges;
  }
}
