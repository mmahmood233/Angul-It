# Angul-It - Multi-Stage Captcha Application

A modern, interactive captcha verification system built with Angular 21. Users prove they're human by completing three image recognition challenges with persistent progress tracking.

## Features

### Core Functionality
- **Multi-Stage Challenges**: Three progressive captcha stages with different themes
- **Image Recognition**: Select correct images from a 3x3 grid
- **State Management**: Progress persists across page refreshes using localStorage
- **Route Protection**: Navigation guards prevent unauthorized access to results
- **Responsive Design**: Mobile-friendly layout with adaptive grid

### Challenge Types
1. **Stage 1**: Select all ANIMALS (🐕🐈🦁🐘🐦)
2. **Stage 2**: Select all VEHICLES (🚗✈️🚲🚢🚁)
3. **Stage 3**: Select all FOOD (🍕🍔🍎🍰🍦)

### Technical Highlights
- Angular 21.1.0 (latest version)
- RxJS for reactive state management
- TypeScript for type safety
- SSR (Server-Side Rendering) compatible
- Modern CSS with gradients and animations

## Project Structure

```
src/app/
├── components/
│   ├── home/          # Welcome page
│   ├── captcha/       # Challenge interface
│   └── result/        # Completion page
├── services/
│   ├── captcha-state.ts   # State management
│   └── challenge.ts       # Challenge data & validation
├── guards/
│   └── completion-guard.ts # Route protection
└── app.routes.ts      # Routing configuration
```

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm (v11 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Angul-It
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

4. Open browser to `http://localhost:4200`

## Available Commands

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## How It Works

### User Flow
1. **Home Page**: User clicks "Start Captcha Challenge"
2. **Challenge Page**: Complete 3 stages by selecting correct images
3. **Validation**: Instant feedback on correct/incorrect selections
4. **Result Page**: View completion summary with time taken

### State Persistence
- Progress saved to localStorage automatically
- Survives page refreshes
- Tracks current stage, results, and timestamps

### Navigation Guards
- Result page protected by `completionGuard`
- Redirects to captcha if not completed
- Ensures proper challenge flow

## Key Components

### CaptchaState Service
Manages application state with RxJS BehaviorSubject:
- Track current stage and progress
- Save/load from localStorage
- Validate stage completion
- Calculate completion time

### Challenge Service
Provides challenge data and validation:
- 3 predefined challenges
- Answer validation logic
- Image data with emojis

### Route Guard
Protects result page from direct access:
- Checks completion status
- Redirects unauthorized users
- Maintains security

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used
- **Angular 21.1.0**: Framework
- **TypeScript 5.9.2**: Language
- **RxJS 7.8.0**: Reactive programming
- **CSS3**: Styling with gradients & animations

## Development Notes

### State Management
Uses RxJS BehaviorSubject for reactive state updates. All components subscribe to state changes for real-time updates.

### SSR Compatibility
Platform checks ensure localStorage is only accessed in browser context, preventing SSR errors.

### Form Validation
- Minimum selection requirement
- Exact match validation
- Visual feedback on submission

## License
This project was created as a learning exercise.

## Author
Built with Angular CLI version 21.1.0
