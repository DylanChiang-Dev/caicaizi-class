import { describe, it, expect } from 'vitest';
import type { Course, TimeSlot } from '../../types/schedule';
import {
  calculateDuration,
  calculateEffectiveWeeks,
  calculateCompletedWeeks,
  parseCourseWeekRange,
  calculateCourseProgress,
  formatDuration,
  getProgressStatus
} from '../progressUtils';

describe('進度計算工具函數', () => {
  const mockTimeSlot: TimeSlot = {
    period: '1-2',
    startTime: '8:15',
    endTime: '9:45'
  };

  const mockCourse: Course = {
    id: 'test-course',
    name: '測試課程',
    classroom: 'A101',
    dayOfWeek: 1,
    periods: '1-2',
    weekType: 'all'
  };

  describe('calculateDuration', () => {
    it('應該正確計算課程持續時間', () => {
      expect(calculateDuration('8:15', '9:45')).toBe(90); // 1小時30分鐘
      expect(calculateDuration('10:05', '11:35')).toBe(90);
      expect(calculateDuration('13:00', '14:30')).toBe(90);
    });

    it('應該處理跨時間的情況', () => {
      expect(calculateDuration('23:00', '01:00')).toBe(-1320); // 負數表示跨天
    });
  });

  describe('calculateEffectiveWeeks', () => {
    it('應該正確計算每週課程的週數', () => {
      expect(calculateEffectiveWeeks('all', 1, 5)).toBe(5);
      expect(calculateEffectiveWeeks('all', 3, 8)).toBe(6);
    });

    it('應該正確計算單週課程的週數', () => {
      expect(calculateEffectiveWeeks('odd', 1, 5)).toBe(3); // 1, 3, 5
      expect(calculateEffectiveWeeks('odd', 2, 6)).toBe(3); // 3, 5
      expect(calculateEffectiveWeeks('odd', 2, 3)).toBe(1); // 3
      expect(calculateEffectiveWeeks('odd', 4, 4)).toBe(0); // 無單週
    });

    it('應該正確計算雙週課程的週數', () => {
      expect(calculateEffectiveWeeks('even', 1, 5)).toBe(2); // 2, 4
      expect(calculateEffectiveWeeks('even', 2, 6)).toBe(3); // 2, 4, 6
      expect(calculateEffectiveWeeks('even', 1, 3)).toBe(1); // 2
      expect(calculateEffectiveWeeks('even', 1, 1)).toBe(0); // 無雙週
    });
  });

  describe('calculateCompletedWeeks', () => {
    it('應該正確計算已完成的週數', () => {
      expect(calculateCompletedWeeks('all', 1, 3)).toBe(3);
      expect(calculateCompletedWeeks('all', 2, 5)).toBe(4);
      expect(calculateCompletedWeeks('all', 5, 3)).toBe(0); // 當前週次小於開始週次
    });

    it('應該正確計算單週課程的已完成週數', () => {
      expect(calculateCompletedWeeks('odd', 1, 5)).toBe(3); // 1, 3, 5
      expect(calculateCompletedWeeks('odd', 1, 4)).toBe(2); // 1, 3
    });

    it('應該正確計算雙週課程的已完成週數', () => {
      expect(calculateCompletedWeeks('even', 1, 5)).toBe(2); // 2, 4
      expect(calculateCompletedWeeks('even', 1, 4)).toBe(2); // 2, 4
    });
  });

  describe('parseCourseWeekRange', () => {
    it('應該正確解析週次範圍', () => {
      expect(parseCourseWeekRange({ ...mockCourse, weekRange: '3-7' }, 20)).toEqual([3, 7]);
      expect(parseCourseWeekRange({ ...mockCourse, weekRange: '1-15' }, 20)).toEqual([1, 15]);
    });

    it('應該使用預設值當沒有週次範圍時', () => {
      expect(parseCourseWeekRange(mockCourse, 20)).toEqual([1, 20]);
    });

    it('應該處理無效的週次範圍', () => {
      expect(parseCourseWeekRange({ ...mockCourse, weekRange: 'invalid' }, 20)).toEqual([1, 20]);
    });
  });

  describe('calculateCourseProgress', () => {
    it('應該正確計算課程進度', () => {
      const progress = calculateCourseProgress(mockCourse, mockTimeSlot, 5);

      expect(progress.course).toBe(mockCourse);
      expect(progress.totalMinutes).toBe(90 * 5); // 5週 * 90分鐘
      expect(progress.completedMinutes).toBe(90 * 5); // 已完成5週
      expect(progress.remainingMinutes).toBe(0);
      expect(progress.progressPercentage).toBe(100);
      expect(progress.isActive).toBe(false); // 當前週次超過課程範圍
    });

    it('應該正確處理未開始的課程', () => {
      const futureCourse = { ...mockCourse, weekRange: '10-15' };
      const progress = calculateCourseProgress(futureCourse, mockTimeSlot, 5);

      expect(progress.totalMinutes).toBe(90 * 6); // 6週 * 90分鐘
      expect(progress.completedMinutes).toBe(0);
      expect(progress.progressPercentage).toBe(0);
      expect(progress.isActive).toBe(false);
    });
  });

  describe('formatDuration', () => {
    it('應該正確格式化時間', () => {
      expect(formatDuration(90)).toBe('1小時30分鐘');
      expect(formatDuration(120)).toBe('2小時');
      expect(formatDuration(30)).toBe('30分鐘');
      expect(formatDuration(0)).toBe('0分鐘');
    });
  });

  describe('getProgressStatus', () => {
    it('應該返回正確的進度狀態', () => {
      expect(getProgressStatus(0)).toEqual({
        label: '尚未開始',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      });

      expect(getProgressStatus(20)).toEqual({
        label: '剛剛開始',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      });

      expect(getProgressStatus(40)).toEqual({
        label: '進行中',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100'
      });

      expect(getProgressStatus(60)).toEqual({
        label: '過半了',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      });

      expect(getProgressStatus(80)).toEqual({
        label: '即將完成',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      });

      expect(getProgressStatus(100)).toEqual({
        label: '已結束',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      });
    });
  });
});