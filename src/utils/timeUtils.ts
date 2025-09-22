// 時間相關工具函數

// 學期開始日期 (2025-09-15，第一週週一)
const SEMESTER_START = new Date('2025-09-15');

// 時間同步狀態
interface TimeSync {
  isNetworkTime: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

let timeSyncStatus: TimeSync = {
  isNetworkTime: false,
  lastSyncTime: null,
  error: null
};

// 網路時間偏移量（毫秒）
let networkTimeOffset = 0;

// 時間API服務列表（按優先級排序）
const TIME_APIS = [
  {
    url: 'https://worldtimeapi.org/api/timezone/Asia/Taipei',
    parser: (data: any) => new Date(data.datetime)
  },
  {
    url: 'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Taipei',
    parser: (data: any) => new Date(data.dateTime)
  },
  {
    url: 'https://worldclockapi.com/api/json/utc/now',
    parser: (data: any) => {
      const utcTime = new Date(data.currentDateTime);
      // 台北時間 = UTC + 8小時
      return new Date(utcTime.getTime() + 8 * 60 * 60 * 1000);
    }
  }
];

/**
 * 從網路時間API獲取當前時間
 * @returns Promise<Date> 網路時間
 */
async function fetchNetworkTime(): Promise<Date> {
  let lastError: Error | null = null;
  
  // 嘗試所有API服務
  for (const api of TIME_APIS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超時
      
      const response = await fetch(api.url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const networkTime = api.parser(data);
      
      // 計算網路時間與本地時間的偏移量
      const localTime = new Date();
      networkTimeOffset = networkTime.getTime() - localTime.getTime();
      
      // 更新同步狀態
      timeSyncStatus = {
        isNetworkTime: true,
        lastSyncTime: new Date(),
        error: null
      };
      
      console.log(`時間同步成功，使用API: ${api.url}`);
      return networkTime;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('未知錯誤');
      console.warn(`時間API ${api.url} 失敗:`, lastError.message);
      continue;
    }
  }
  
  // 所有API都失敗
  timeSyncStatus = {
    isNetworkTime: false,
    lastSyncTime: timeSyncStatus.lastSyncTime,
    error: lastError ? lastError.message : '所有時間API都無法連接'
  };
  
  throw lastError || new Error('所有時間API都無法連接');
}

/**
 * 獲取當前時間（優先使用網路時間）
 * @returns Date 當前時間
 */
export function getCurrentTime(): Date {
  if (timeSyncStatus.isNetworkTime && networkTimeOffset !== 0) {
    // 使用網路時間偏移量計算當前時間
    return new Date(Date.now() + networkTimeOffset);
  }
  // 回退到本地時間
  return new Date();
}

/**
 * 初始化時間同步
 * @returns Promise<boolean> 是否成功同步
 */
export async function initTimeSync(): Promise<boolean> {
  try {
    await fetchNetworkTime();
    return true;
  } catch (error) {
    console.warn('時間同步失敗，使用本地時間:', error);
    return false;
  }
}

/**
 * 獲取時間同步狀態
 * @returns TimeSync 同步狀態
 */
export function getTimeSyncStatus(): TimeSync {
  return { ...timeSyncStatus };
}

/**
 * 獲取當前學期週次
 * @returns 當前週次 (從1開始)
 */
export function getCurrentWeek(): number {
  const now = getCurrentTime();
  
  // 獲取當前日期的週一
  const currentMonday = new Date(now);
  const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 計算到週一的天數
  currentMonday.setDate(now.getDate() - daysToMonday);
  currentMonday.setHours(0, 0, 0, 0); // 設置為當天00:00:00
  
  // 學期開始日期的週一
  const semesterMonday = new Date(SEMESTER_START);
  semesterMonday.setHours(0, 0, 0, 0);
  
  // 計算週數差異
  const diffTime = currentMonday.getTime() - semesterMonday.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return Math.max(1, diffWeeks + 1); // 第一週從1開始
}

/**
 * 獲取當前是星期幾
 * @returns 星期幾 (1-7, 1=星期一, 7=星期日)
 */
export function getCurrentDayOfWeek(): number {
  const now = getCurrentTime();
  const day = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  return day === 0 ? 7 : day; // 轉換為 1-7 格式
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
  const currentTime = now.getHours() * 60 + now.getMinutes(); // 當前時間（分鐘）
  
  // 時間段映射
  const timeMap: Record<string, [number, number]> = {
    '1-2': [8 * 60 + 15, 9 * 60 + 45], // 8:15-9:45
    '3-4': [10 * 60 + 5, 11 * 60 + 35], // 10:05-11:35
    '5-6': [13 * 60, 14 * 60 + 30], // 13:00-14:30
    '7-8': [14 * 60 + 50, 16 * 60 + 20], // 14:50-16:20
    '9': [16 * 60 + 30, 17 * 60 + 15], // 16:30-17:15
    '10-11': [18 * 60 + 15, 19 * 60 + 45], // 18:15-19:45
    '12': [19 * 60 + 55, 20 * 60 + 40] // 19:55-20:40
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
  if (weekRange) {
    if (!isWeekInRange(weekNumber, weekRange)) {
      return false;
    }
  }
  
  // 然後檢查單雙週類型
  switch (weekType) {
    case 'all':
      return true;
    case 'odd':
      return weekNumber % 2 === 1; // 單週：1, 3, 5, 7...
    case 'even':
      return weekNumber % 2 === 0; // 雙週：2, 4, 6, 8...
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
  
  // 解析週次範圍，支持格式如 "1-15", "3-18" 等
  const match = weekRange.match(/^(\d+)-(\d+)$/);
  if (!match) return true; // 如果格式不正確，默認顯示
  
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