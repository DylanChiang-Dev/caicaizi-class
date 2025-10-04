import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the date and time functions
const mockDate = new Date('2025-10-04T10:30:00'); // 2025年10月4日 10:30 (星期六)

// Mock the getCurrentTime function
vi.mock('../timeUtils', async () => {
  const actual = await vi.importActual<typeof import('../timeUtils')>('../timeUtils');
  return {
    ...actual,
    getCurrentTime: vi.fn(() => mockDate),
  };
});

// Import after mocking
import {
  getCurrentWeek,
  getCurrentDayOfWeek,
  isToday,
  isCurrentTimePeriod,
  shouldShowCourse,
  isWeekInRange,
  getWeekTypeDisplay,
  formatDate,
  getCurrentDateString
} from '../timeUtils';

describe('時間工具函數', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentWeek', () => {
    it('應該正確計算當前週次', () => {
      // 2025-09-15 是第一週週一
      // 2025-10-04 是第3週週六
      const week = getCurrentWeek();
      expect(week).toBe(3);
    });
  });

  describe('getCurrentDayOfWeek', () => {
    it('應該正確返回當前是星期幾', () => {
      const dayOfWeek = getCurrentDayOfWeek();
      expect(dayOfWeek).toBe(6); // 星期六
    });
  });

  describe('isToday', () => {
    it('應該正確判斷是否為今天', () => {
      expect(isToday(6)).toBe(true); // 星期六是今天
      expect(isToday(1)).toBe(false); // 星期一不是今天
    });
  });

  describe('isCurrentTimePeriod', () => {
    it('應該正確判斷當前時間段', () => {
      // 當前時間是 10:30，應該在 "3-4" 節次 (10:05-11:35)
      expect(isCurrentTimePeriod('3-4')).toBe(true);
      expect(isCurrentTimePeriod('1-2')).toBe(false); // 8:15-9:45
      expect(isCurrentTimePeriod('5-6')).toBe(false); // 13:00-14:30
    });
  });

  describe('shouldShowCourse', () => {
    it('應該正確判斷課程是否應該顯示', () => {
      // 每週課程應該總是顯示
      expect(shouldShowCourse('all', 1)).toBe(true);
      expect(shouldShowCourse('all', 2)).toBe(true);

      // 單週課程只在單週顯示
      expect(shouldShowCourse('odd', 1)).toBe(true);
      expect(shouldShowCourse('odd', 2)).toBe(false);
      expect(shouldShowCourse('odd', 3)).toBe(true);

      // 雙週課程只在雙週顯示
      expect(shouldShowCourse('even', 1)).toBe(false);
      expect(shouldShowCourse('even', 2)).toBe(true);
      expect(shouldShowCourse('even', 3)).toBe(false);

      // 週次範圍限制
      expect(shouldShowCourse('all', 5, '1-4')).toBe(false);
      expect(shouldShowCourse('all', 3, '1-4')).toBe(true);
    });
  });

  describe('isWeekInRange', () => {
    it('應該正確判斷週次是否在範圍內', () => {
      expect(isWeekInRange(3, '1-5')).toBe(true);
      expect(isWeekInRange(6, '1-5')).toBe(false);
      expect(isWeekInRange(1, '1-5')).toBe(true);
      expect(isWeekInRange(5, '1-5')).toBe(true);

      // 無效範圍格式應該返回 true
      expect(isWeekInRange(3, 'invalid')).toBe(true);
    });
  });

  describe('getWeekTypeDisplay', () => {
    it('應該返回正確的中文顯示', () => {
      expect(getWeekTypeDisplay('all')).toBe('每週');
      expect(getWeekTypeDisplay('odd')).toBe('單週');
      expect(getWeekTypeDisplay('even')).toBe('雙週');
    });
  });

  describe('formatDate', () => {
    it('應該正確格式化日期', () => {
      const testDate = new Date('2025-01-05');
      expect(formatDate(testDate)).toBe('2025-01-05');
    });

    it('應該正確處理個位數月份和日期', () => {
      const testDate = new Date('2025-01-01');
      expect(formatDate(testDate)).toBe('2025-01-01');
    });
  });

  describe('getCurrentDateString', () => {
    it('應該返回當前日期字符串', () => {
      const dateString = getCurrentDateString();
      expect(dateString).toBe('2025-10-04');
    });
  });
});