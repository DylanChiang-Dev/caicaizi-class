// 學期進度計算工具 - 優化版本
// 提供更高效、更準確的進度統計功能

import type { Course, TimeSlot, ScheduleData } from '@/types/schedule';
import { getCurrentWeek } from './timeUtils';

// 進度統計結果類型
export interface SemesterProgress {
  totalMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  progressPercentage: number;
  totalCourses: number;
  completedCourses: number;
  averageWeeksPerCourse: number;
}

// 課程進度詳情
export interface CourseProgress {
  course: Course;
  totalMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  progressPercentage: number;
  isActive: boolean;
  weeksCount: number;
  completedWeeks: number;
}

/**
 * 計算時間段的持續時間（分鐘）
 * @param startTime 開始時間 "HH:MM"
 * @param endTime 結束時間 "HH:MM"
 * @returns 持續時間（分鐘）
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  return (endHour * 60 + endMin) - (startHour * 60 + startMin);
}

/**
 * 根據週次類型計算實際週數
 * @param weekType 週次類型
 * @param startWeek 開始週次
 * @param endWeek 結束週次
 * @returns 實際週數
 */
export function calculateEffectiveWeeks(
  weekType: 'all' | 'odd' | 'even',
  startWeek: number,
  endWeek: number
): number {
  if (weekType === 'all') {
    return endWeek - startWeek + 1;
  }

  if (weekType === 'odd') {
    // 計算奇數週的數量
    const firstOddWeek = startWeek % 2 === 1 ? startWeek : startWeek + 1;
    const lastOddWeek = endWeek % 2 === 1 ? endWeek : endWeek - 1;

    if (firstOddWeek > lastOddWeek) return 0;

    return Math.floor((lastOddWeek - firstOddWeek) / 2) + 1;
  }

  if (weekType === 'even') {
    // 計算偶數週的數量
    const firstEvenWeek = startWeek % 2 === 0 ? startWeek : startWeek + 1;
    const lastEvenWeek = endWeek % 2 === 0 ? endWeek : endWeek - 1;

    if (firstEvenWeek > lastEvenWeek) return 0;

    return Math.floor((lastEvenWeek - firstEvenWeek) / 2) + 1;
  }

  return 0;
}

/**
 * 計算已完成的週數
 * @param weekType 週次類型
 * @param startWeek 開始週次
 * @param currentWeek 當前週次
 * @returns 已完成的週數
 */
export function calculateCompletedWeeks(
  weekType: 'all' | 'odd' | 'even',
  startWeek: number,
  currentWeek: number
): number {
  if (currentWeek < startWeek) return 0;

  return calculateEffectiveWeeks(weekType, startWeek, currentWeek);
}

/**
 * 解析課程週次範圍
 * @param course 課程對象
 * @param defaultMaxWeek 預設最大週次
 * @returns [開始週次, 結束週次]
 */
export function parseCourseWeekRange(
  course: Course,
  defaultMaxWeek: number
): [number, number] {
  if (!course.weekRange) {
    return [1, defaultMaxWeek];
  }

  const match = course.weekRange.match(/^(\d+)-(\d+)$/);
  if (!match) {
    return [1, defaultMaxWeek];
  }

  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);

  return [start, end];
}

/**
 * 計算單個課程的進度
 * @param course 課程對象
 * @param timeSlot 時間段
 * @param currentWeek 當前週次
 * @returns 課程進度詳情
 */
export function calculateCourseProgress(
  course: Course,
  timeSlot: TimeSlot,
  currentWeek: number
): CourseProgress {
  const [courseStartWeek, courseEndWeek] = parseCourseWeekRange(course, 20);
  const effectiveCurrentWeek = Math.min(currentWeek, courseEndWeek);

  // 計算課程持續時間
  const durationMinutes = calculateDuration(timeSlot.startTime, timeSlot.endTime);

  // 計算總週數和已完成週數
  const totalWeeks = calculateEffectiveWeeks(course.weekType, courseStartWeek, courseEndWeek);
  const completedWeeks = calculateCompletedWeeks(course.weekType, courseStartWeek, effectiveCurrentWeek);

  // 計算時間
  const totalMinutes = durationMinutes * totalWeeks;
  const completedMinutes = durationMinutes * completedWeeks;
  const remainingMinutes = totalMinutes - completedMinutes;

  // 計算進度百分比
  const progressPercentage = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;

  // 判斷課程是否活躍
  const isActive = currentWeek >= courseStartWeek && currentWeek <= courseEndWeek;

  return {
    course,
    totalMinutes,
    completedMinutes,
    remainingMinutes,
    progressPercentage,
    isActive,
    weeksCount: totalWeeks,
    completedWeeks
  };
}

/**
 * 計算整個學期的進度
 * @param scheduleData 課表數據
 * @param currentWeek 當前週次（可選，自動獲取）
 * @returns 學期進度統計
 */
export function calculateSemesterProgress(
  scheduleData: ScheduleData,
  currentWeek?: number
): SemesterProgress {
  const effectiveCurrentWeek = currentWeek ?? getCurrentWeek();

  // 創建時間段查找映射以提高性能
  const timeSlotMap = new Map<string, TimeSlot>(
    scheduleData.timeSlots.map(slot => [slot.period, slot])
  );

  let totalMinutes = 0;
  let completedMinutes = 0;
  let activeCoursesCount = 0;
  let totalCoursesCount = 0;

  // 計算每個課程的進度
  scheduleData.courses.forEach(course => {
    const timeSlot = timeSlotMap.get(course.periods);
    if (!timeSlot) return; // 跳過無效時間段的課程

    totalCoursesCount++;

    const progress = calculateCourseProgress(course, timeSlot, effectiveCurrentWeek);
    totalMinutes += progress.totalMinutes;
    completedMinutes += progress.completedMinutes;

    if (progress.isActive) {
      activeCoursesCount++;
    }
  });

  const remainingMinutes = totalMinutes - completedMinutes;
  const progressPercentage = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;

  // 計算平均每門課的週數
  const averageWeeksPerCourse = totalCoursesCount > 0
    ? scheduleData.courses.reduce((sum, course) => {
        const [start, end] = parseCourseWeekRange(course, 20);
        return sum + (end - start + 1);
      }, 0) / totalCoursesCount
    : 0;

  return {
    totalMinutes,
    completedMinutes,
    remainingMinutes,
    progressPercentage,
    totalCourses: totalCoursesCount,
    completedCourses: activeCoursesCount,
    averageWeeksPerCourse
  };
}

/**
 * 獲取所有課程的詳細進度
 * @param scheduleData 課表數據
 * @param currentWeek 當前週次（可選）
 * @returns 課程進度列表
 */
export function getAllCoursesProgress(
  scheduleData: ScheduleData,
  currentWeek?: number
): CourseProgress[] {
  const effectiveCurrentWeek = currentWeek ?? getCurrentWeek();

  const timeSlotMap = new Map<string, TimeSlot>(
    scheduleData.timeSlots.map(slot => [slot.period, slot])
  );

  return scheduleData.courses
    .map(course => {
      const timeSlot = timeSlotMap.get(course.periods);
      return timeSlot ? calculateCourseProgress(course, timeSlot, effectiveCurrentWeek) : null;
    })
    .filter((progress): progress is CourseProgress => progress !== null)
    .sort((a, b) => b.progressPercentage - a.progressPercentage); // 按進度降序排列
}

/**
 * 格式化時間顯示
 * @param minutes 分鐘數
 * @returns 格式化的時間字符串
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours === 0) {
    return `${mins}分鐘`;
  } else if (mins === 0) {
    return `${hours}小時`;
  } else {
    return `${hours}小時${mins}分鐘`;
  }
}

/**
 * 獲取進度狀態描述
 * @param percentage 進度百分比
 * @returns 狀態描述
 */
export function getProgressStatus(percentage: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (percentage === 0) {
    return {
      label: '尚未開始',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    };
  } else if (percentage < 25) {
    return {
      label: '剛剛開始',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    };
  } else if (percentage < 50) {
    return {
      label: '進行中',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    };
  } else if (percentage < 75) {
    return {
      label: '過半了',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    };
  } else if (percentage < 100) {
    return {
      label: '即將完成',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    };
  } else {
    return {
      label: '已結束',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    };
  }
}