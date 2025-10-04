// 時間相關工具函數 - 2025 重構版本
// 使用更簡單、更可靠的時間處理方式

import { z } from 'zod';

// 學期開始日期 (2025-09-15，第一週週一)
const SEMESTER_START = new Date('2025-09-15');

// 時間同步狀態類型
const TimeSyncSchema = z.object({
  isNetworkTime: z.boolean(),
  lastSyncTime: z.date().nullable(),
  error: z.string().nullable(),
  offset: z.number()
});

export type TimeSync = z.infer<typeof TimeSyncSchema>;

// 全局時間同步狀態
let timeSyncState: TimeSync = {
  isNetworkTime: false,
  lastSyncTime: null,
  error: null,
  offset: 0
};

// 本地存儲鍵值
const TIME_SYNC_KEY = 'caicaizi-time-sync';
const SYNC_INTERVAL = 30 * 60 * 1000; // 30分鐘
const SYNC_TIMEOUT = 5000; // 5秒超時

/**
 * 時間API配置 - 使用單一可靠的API
 */
const TIME_API = {
  url: 'https://worldtimeapi.org/api/timezone/Asia/Taipei',
  timeout: SYNC_TIMEOUT
};

/**
 * 從本地存儲加載時間同步狀態
 */
function loadTimeSyncState(): void {
  try {
    const stored = localStorage.getItem(TIME_SYNC_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 轉換日期字符串回Date對象
      if (parsed.lastSyncTime) {
        parsed.lastSyncTime = new Date(parsed.lastSyncTime);
      }
      timeSyncState = TimeSyncSchema.parse(parsed);
    }
  } catch (error) {
    console.warn('載入時間同步狀態失敗:', error);
  }
}

/**
 * 保存時間同步狀態到本地存儲
 */
function saveTimeSyncState(): void {
  try {
    localStorage.setItem(TIME_SYNC_KEY, JSON.stringify(timeSyncState));
  } catch (error) {
    console.warn('保存時間同步狀態失敗:', error);
  }
}

/**
 * 簡化的網路時間同步
 * @returns Promise<boolean> 是否成功同步
 */
export async function syncTimeWithNetwork(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT);

    const response = await fetch(TIME_API.url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const networkTime = new Date(data.datetime);
    const localTime = new Date();

    // 計算偏移量並更新狀態
    timeSyncState = {
      isNetworkTime: true,
      lastSyncTime: new Date(),
      error: null,
      offset: networkTime.getTime() - localTime.getTime()
    };

    saveTimeSyncState();
    console.log('✅ 時間同步成功');
    return true;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    timeSyncState.error = errorMessage;

    // 如果超過30分鐘沒有同步，標記為非網路時間
    if (timeSyncState.lastSyncTime) {
      const timeSinceLastSync = Date.now() - timeSyncState.lastSyncTime.getTime();
      if (timeSinceLastSync > SYNC_INTERVAL) {
        timeSyncState.isNetworkTime = false;
      }
    }

    saveTimeSyncState();
    console.warn('⚠️ 時間同步失敗:', errorMessage);
    return false;
  }
}

/**
 * 獲取當前時間（優先使用同步的網路時間）
 * @returns Date 當前時間
 */
export function getCurrentTime(): Date {
  // 初始化時載入狀態
  if (!timeSyncState.lastSyncTime) {
    loadTimeSyncState();
  }

  if (timeSyncState.isNetworkTime && timeSyncState.lastSyncTime) {
    // 檢查同步是否過期
    const timeSinceLastSync = Date.now() - timeSyncState.lastSyncTime.getTime();
    if (timeSinceLastSync <= SYNC_INTERVAL) {
      return new Date(Date.now() + timeSyncState.offset);
    }
    // 同步過期，回退到本地時間
    timeSyncState.isNetworkTime = false;
    saveTimeSyncState();
  }

  return new Date();
}

/**
 * 獲取時間同步狀態
 * @returns TimeSync 當前同步狀態
 */
export function getTimeSyncStatus(): TimeSync {
  return { ...timeSyncState };
}

/**
 * 初始化時間同步系統
 */
export async function initTimeSync(): Promise<void> {
  loadTimeSyncState();

  // 如果沒有同步過或同步過期，嘗試同步
  if (!timeSyncState.lastSyncTime ||
      (Date.now() - timeSyncState.lastSyncTime.getTime() > SYNC_INTERVAL)) {
    await syncTimeWithNetwork();
  }
}

/**
 * 獲取當前學期週次
 * @returns 當前週次 (從1開始)
 */
export function getCurrentWeek(): number {
  const now = getCurrentTime();

  // 獲取當前日期的週一
  const currentMonday = new Date(now);
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  currentMonday.setDate(now.getDate() - daysToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  // 學期開始日期的週一
  const semesterMonday = new Date(SEMESTER_START);
  semesterMonday.setHours(0, 0, 0, 0);

  // 計算週數差異
  const diffTime = currentMonday.getTime() - semesterMonday.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  return Math.max(1, diffWeeks + 1);
}

/**
 * 獲取當前是星期幾
 * @returns 星期幾 (1-7, 1=星期一, 7=星期日)
 */
export function getCurrentDayOfWeek(): number {
  const now = getCurrentTime();
  const day = now.getDay();
  return day === 0 ? 7 : day;
}

/**
 * 檢查是否為今天
 * @param dayOfWeek 星期幾 (1-7)
 * @returns 是否為今天
 */
export function isToday(dayOfWeek: number): boolean {
  return getCurrentDayOfWeek() === dayOfWeek;
}

/**
 * 檢查是否為當前時間段
 * @param periods 節次，如 "1-2", "3-4"
 * @returns 是否為當前時間段
 */
export function isCurrentTimePeriod(periods: string): boolean {
  const now = getCurrentTime();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // 時間段映射
  const timeMap: Record<string, [number, number]> = {
    '1-2': [8 * 60 + 15, 9 * 60 + 45],
    '3-4': [10 * 60 + 5, 11 * 60 + 35],
    '5-6': [13 * 60, 14 * 60 + 30],
    '7-8': [14 * 60 + 50, 16 * 60 + 20],
    '9': [16 * 60 + 30, 17 * 60 + 15],
    '10-11': [18 * 60 + 15, 19 * 60 + 45],
    '12': [19 * 60 + 55, 20 * 60 + 40]
  };

  const timeRange = timeMap[periods];
  if (!timeRange) return false;

  const [startTime, endTime] = timeRange;
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * 格式化日期顯示
 * @param date 日期對象
 * @returns 格式化的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 獲取當前日期字符串
 * @returns 當前日期字符串
 */
export function getCurrentDateString(): string {
  return formatDate(getCurrentTime());
}

/**
 * 判斷課程是否應該在指定週次顯示
 * @param weekType 週次類型 ('all' | 'odd' | 'even')
 * @param weekNumber 週次數字
 * @param weekRange 週次範圍，如 "1-15", "1-18" 等
 * @returns 是否應該顯示
 */
export function shouldShowCourse(
  weekType: 'all' | 'odd' | 'even',
  weekNumber: number,
  weekRange?: string
): boolean {
  // 首先檢查週次範圍
  if (weekRange && !isWeekInRange(weekNumber, weekRange)) {
    return false;
  }

  // 然後檢查單雙週類型
  switch (weekType) {
    case 'all':
      return true;
    case 'odd':
      return weekNumber % 2 === 1;
    case 'even':
      return weekNumber % 2 === 0;
    default:
      return true;
  }
}

/**
 * 檢查週次是否在指定範圍內
 * @param weekNumber 週次數字
 * @param weekRange 週次範圍，如 "1-15", "1-18" 等
 * @returns 是否在範圍內
 */
export function isWeekInRange(weekNumber: number, weekRange: string): boolean {
  if (!weekRange) return true;

  const match = weekRange.match(/^(\d+)-(\d+)$/);
  if (!match) return true;

  const startWeek = parseInt(match[1], 10);
  const endWeek = parseInt(match[2], 10);

  return weekNumber >= startWeek && weekNumber <= endWeek;
}

/**
 * 獲取週次類型的中文顯示
 * @param weekType 週次類型
 * @returns 中文顯示
 */
export function getWeekTypeDisplay(weekType: 'all' | 'odd' | 'even'): string {
  switch (weekType) {
    case 'all':
      return '每週';
    case 'odd':
      return '單週';
    case 'even':
      return '雙週';
    default:
      return '每週';
  }
}