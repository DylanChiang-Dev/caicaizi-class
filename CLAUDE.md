# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based course schedule management system for "菜菜子" (Caicaizi) that provides an intuitive way to view and manage course schedules. The application features intelligent week management, responsive design, and semester progress tracking.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (includes TypeScript compilation)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run check        # TypeScript type checking without emitting files

# Dependencies
npm install          # Install dependencies
```

## Architecture Overview

### Core Structure
- **Single Page Application**: Uses React Router with main route at `/`
- **TypeScript Configuration**: Strict mode disabled, path aliases configured (`@/*` → `./src/*`)
- **State Management**: Zustand for global state (imported but minimal usage)
- **Styling**: Tailwind CSS with modern gradient backgrounds and card-based design

### Key Components
- `App.tsx`: Root component with time synchronization system and network status indicator
- `Home.tsx`: Main page displaying course schedule and semester progress
- `ScheduleTable.tsx`: Core schedule rendering with responsive grid layout
- `WeekSelector.tsx`: Week navigation with odd/even week support
- `CourseCard.tsx`: Individual course display with modal details
- `CourseModal.tsx`: Detailed course information popup

### Data Management
- `scheduleData.ts`: Static course data with time slots and course information
- `timeUtils.ts`: Complex time synchronization system using multiple APIs for accurate network time
- Types defined in `types/schedule.ts` with comprehensive Course, TimeSlot, and ScheduleData interfaces

### Time System Features
- **Network Time Synchronization**: Falls back to local time if network unavailable
- **Semester Week Calculation**: Based on semester start date (2025-09-15)
- **Smart Course Filtering**: Supports odd/even weeks and week ranges
- **Real-time Status**: Visual indicator for time sync status

### Course Schedule Logic
- **Week Types**: 'all', 'odd', 'even' with intelligent filtering
- **Week Ranges**: Support for date ranges like "1-15" weeks
- **Time Periods**: Mapped to specific time slots (e.g., "1-2" → 8:15-9:45)
- **Current Time Highlighting**: Shows active courses based on real time

## Development Notes

- Uses `@` path alias for imports (`@/components/X` → `./src/components/X`)
- Time synchronization runs every 30 minutes and retries multiple APIs on failure
- Responsive design prioritized for both desktop and mobile viewing
- Build process includes TypeScript compilation with Vite
- ESLint configured for code quality enforcement
- Source maps hidden in production builds for security