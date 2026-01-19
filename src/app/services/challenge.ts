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
  private imageSelectionVariants = [
    {
      question: 'Select all images containing ANIMALS',
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
      question: 'Select all images containing FOOD',
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
    {
      question: 'Select all images containing VEHICLES',
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
  ];

  private mathProblems = [
    { problem: 'What is 7 + 5?', answer: '12' },
    { problem: 'What is 9 - 4?', answer: '5' },
    { problem: 'What is 6 × 3?', answer: '18' },
    { problem: 'What is 15 ÷ 3?', answer: '5' },
    { problem: 'What is 8 + 6?', answer: '14' },
    { problem: 'What is 20 - 7?', answer: '13' },
  ];

  private textWords = [
    { word: 'HUMAN', variants: ['HUMAN', 'human'] },
    { word: 'ROBOT', variants: ['ROBOT', 'robot'] },
    { word: 'VERIFY', variants: ['VERIFY', 'verify'] },
    { word: 'ACCESS', variants: ['ACCESS', 'access'] },
    { word: 'SECURE', variants: ['SECURE', 'secure'] },
  ];

  private challenges: ChallengeData[] = [];

  constructor() {
    this.generateRandomChallenges();
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateRandomChallenges(): void {
    // Stage 1: Random image selection
    const imageVariant = this.getRandomItem(this.imageSelectionVariants);
    
    // Stage 2: Random math problem
    const mathProblem = this.getRandomItem(this.mathProblems);
    
    // Stage 3: Random text word
    const textWord = this.getRandomItem(this.textWords);

    this.challenges = [
      {
        stage: 1,
        question: imageVariant.question,
        type: 'select-multiple',
        images: imageVariant.images,
        correctAnswers: imageVariant.correctAnswers,
      },
      {
        stage: 2,
        question: 'Solve the math problem',
        type: 'math',
        mathProblem: mathProblem.problem,
        correctAnswers: [mathProblem.answer],
      },
      {
        stage: 3,
        question: 'Type the word shown below',
        type: 'text-input',
        textPrompt: textWord.word,
        correctAnswers: textWord.variants,
      },
    ];
  }

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
