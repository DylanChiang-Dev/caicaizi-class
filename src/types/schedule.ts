// 課表相關數據類型定義

// 時間段類型
export interface TimeSlot {
  period: string; // 節次，如 "1-2", "3-4"
  startTime: string; // 開始時間，如 "8:15"
  endTime: string; // 結束時間，如 "9:45"
}

// 課程類型
export type WeekType = 'all' | 'odd' | 'even';

export interface Course {
  id: string; // 課程唯一標識
  name: string; // 課程名稱
  classroom: string; // 教室位置
  dayOfWeek: number; // 星期幾 (1-7, 1=星期一)
  periods: string; // 節次，如 "1-2", "3-4"
  weekRange?: string; // 週次範圍，如 "1-15", "1-18" 等
  weekType: WeekType; // 週次類型：全週、單週、雙週
  studentCount?: number; // 學生人數
  note?: string; // 備註信息
  description?: string; // 課程描述
  // 保留 timePeriod 字段以兼容舊數據，但建議使用 weekRange
  timePeriod?: string; // @deprecated 使用 weekRange 替代
}

// 課表數據類型
export interface ScheduleData {
  timeSlots: TimeSlot[]; // 作息時間表
  courses: Course[]; // 課程列表
  notes: string[]; // 特殊說明
  specialNotes?: string[]; // 特殊說明（可選）
}

// 星期枚舉
export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

// 星期名稱映射
export const DAY_NAMES = {
  [DayOfWeek.MONDAY]: '星期一',
  [DayOfWeek.TUESDAY]: '星期二',
  [DayOfWeek.WEDNESDAY]: '星期三',
  [DayOfWeek.THURSDAY]: '星期四',
  [DayOfWeek.FRIDAY]: '星期五',
  [DayOfWeek.SATURDAY]: '星期六',
  [DayOfWeek.SUNDAY]: '星期日'
};