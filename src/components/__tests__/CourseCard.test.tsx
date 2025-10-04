import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCard } from '../CourseCard';
import type { Course } from '../../types/schedule';

const mockCourse: Course = {
  id: 'test-course',
  name: '測試課程',
  classroom: 'A101',
  dayOfWeek: 1,
  periods: '1-2',
  weekType: 'all'
};

// Mock timeUtils to control the behavior
vi.mock('../../utils/timeUtils', () => ({
  isToday: () => false,
  isCurrentTimePeriod: () => false,
  getWeekTypeDisplay: (type: string) => {
    switch (type) {
      case 'odd': return '單週';
      case 'even': return '雙週';
      default: return '每週';
    }
  }
}));

describe('CourseCard', () => {
  it('應該正確渲染課程卡片', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('測試課程')).toBeInTheDocument();
    expect(screen.getByText('A101')).toBeInTheDocument();
    expect(screen.getByText('每週')).toBeInTheDocument();
    expect(screen.getByText('1-2')).toBeInTheDocument();
  });

  it('應該正確顯示單週課程', () => {
    const oddWeekCourse = { ...mockCourse, weekType: 'odd' as const };
    render(<CourseCard course={oddWeekCourse} />);

    expect(screen.getByText('單週')).toBeInTheDocument();
  });

  it('應該正確顯示雙週課程', () => {
    const evenWeekCourse = { ...mockCourse, weekType: 'even' as const };
    render(<CourseCard course={evenWeekCourse} />);

    expect(screen.getByText('雙週')).toBeInTheDocument();
  });

  it('應該正確顯示週次範圍', () => {
    const courseWithRange = { ...mockCourse, weekRange: '3-15' };
    render(<CourseCard course={courseWithRange} />);

    expect(screen.getByText('3-15週')).toBeInTheDocument();
  });

  it('應該正確處理點擊事件', () => {
    const handleClick = vi.fn();
    render(<CourseCard course={mockCourse} onClick={handleClick} />);

    const card = screen.getByText('測試課程').closest('div');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledWith(mockCourse);
    }
  });

  it('應該正確顯示學生人數', () => {
    const courseWithStudents = { ...mockCourse, studentCount: 30 };
    render(<CourseCard course={courseWithStudents} />);

    expect(screen.getByText('30人')).toBeInTheDocument();
  });

  it('應該顯示預設的週次範圍', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('1-18週')).toBeInTheDocument();
  });
});