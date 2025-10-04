import React, { memo, useMemo, useCallback } from 'react';
import type { Course, TimeSlot } from '../types/schedule';
import { DAY_NAMES, DayOfWeek } from '../types/schedule';
import { CourseCard } from './CourseCard';
import { isToday, shouldShowCourse, isCurrentTimePeriod } from '../utils/timeUtils';

interface ScheduleTableProps {
  courses: Course[];
  timeSlots: TimeSlot[];
  currentWeek: number;
  onCourseClick?: (course: Course) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = memo(({
  courses,
  timeSlots,
  currentWeek,
  onCourseClick
}) => {
  // 工作日 (星期一到星期五) - 使用 useMemo 優化
  const weekdays = useMemo(() => [1, 2, 3, 4, 5], []);
  
  // 计算每个时间段的最佳高度
  const getRowHeight = (period: string): string => {
    const rowCourses = weekdays.map(day => getCourseByDayAndPeriod(day, period)).filter(Boolean);
    if (rowCourses.length === 0) {
      return '4rem'; // 无课程时的最小高度
    }
    // 有课程时根据内容自适应，但设置合理的最小高度
    return 'max-content';
  };
  
  // 根據星期和節次獲取課程（考慮週次過濾）- 使用 useCallback 優化
  const getCourseByDayAndPeriod = useCallback((dayOfWeek: number, period: string): Course | undefined => {
    return courses.find(course =>
      course.dayOfWeek === dayOfWeek &&
      course.periods === period &&
      shouldShowCourse(course.weekType, currentWeek, course.weekRange || course.timePeriod)
    );
  }, [courses, currentWeek]);

  // 過濾當前週次應該顯示的課程 - 使用 useCallback 優化
  const getFilteredCourses = useCallback((dayOfWeek: number): Course[] => {
    return courses.filter(course =>
      course.dayOfWeek === dayOfWeek &&
      shouldShowCourse(course.weekType, currentWeek, course.weekRange || course.timePeriod)
    );
  }, [courses, currentWeek]);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
      {/* 桌面端表格佈局 */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* 表格容器使用CSS Grid实现完美对齐 */}
          <div 
            className="grid min-w-[800px] border border-gray-200"
            style={{
              gridTemplateColumns: 'minmax(120px, auto) repeat(5, 1fr)',
              gridTemplateRows: `auto ${timeSlots.map(slot => `minmax(${getRowHeight(slot.period)}, max-content)`).join(' ')}`
            }}
          >
            {/* 時間列表頭 */}
            <div className="bg-blue-600 text-white font-medium text-sm flex items-center justify-center border-b border-r border-gray-200 h-12">
              作息時間
            </div>
            
            {/* 星期表頭 */}
            {weekdays.map(day => {
              const dayName = DAY_NAMES[day as DayOfWeek];
              const isTodayColumn = isToday(day);
              
              return (
                <div 
                  key={`header-${day}`} 
                  className={`
                    h-12 flex items-center justify-center font-medium text-sm border-b border-r border-gray-200 last:border-r-0
                    ${isTodayColumn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {dayName}
                  {isTodayColumn && (
                    <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                      今天
                    </span>
                  )}
                </div>
              );
            })}
            
            {/* 時間段和課程格子 */}
            {timeSlots.map((slot, rowIndex) => {
              const isCurrent = isCurrentTimePeriod(slot.period);
              
              return (
                <React.Fragment key={`row-${slot.period}`}>
                  {/* 時間段 */}
                  <div
                    className={`
                      border-b border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col justify-center
                      ${isCurrent
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-slate-800/50'
                      }
                    `}
                    style={{ gridRow: rowIndex + 2, gridColumn: 1 }}
                  >
                    <div className={`font-bold text-sm mb-1 ${
                      isCurrent
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      第{slot.period}節
                    </div>
                    <div className={`text-xs ${
                      isCurrent ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {slot.startTime}
                    </div>
                    <div className={`text-xs ${
                      isCurrent ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {slot.endTime}
                    </div>
                    {isCurrent && (
                      <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                        ⏰ 當前
                      </div>
                    )}
                  </div>
                  
                  {/* 課程格子 */}
                  {weekdays.map((day, colIndex) => {
                    const course = getCourseByDayAndPeriod(day, slot.period);
                    
                    return (
                      <div
                         key={`${day}-${slot.period}`}
                         className="border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-1 flex items-stretch"
                         style={{
                           gridRow: rowIndex + 2,
                           gridColumn: colIndex + 2
                         }}
                      >
                        {course ? (
                           <CourseCard course={course} onClick={onCourseClick ?? undefined} />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs">
                             無課程
                           </div>
                         )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 移動端卡片佈局 */}
      <div className="md:hidden">
        {weekdays.map(day => {
          const dayName = DAY_NAMES[day as DayOfWeek];
          const isTodayColumn = isToday(day);
          const dayCourses = getFilteredCourses(day);
          
          return (
            <div key={day} className="mb-6">
              {/* 星期標題 */}
              <div className={`
                p-3 font-medium text-center rounded-t-lg
                ${isTodayColumn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                }
              `}>
                {dayName}
                {isTodayColumn && (
                  <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                    今天
                  </span>
                )}
              </div>
              
              {/* 課程列表 */}
              <div className="border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-lg bg-white dark:bg-slate-800">
                {dayCourses.length > 0 ? (
                  <div className="p-3 space-y-3">
                    {dayCourses.map(course => {
                      const timeSlot = timeSlots.find(slot => slot.period === course.periods);

                      return (
                        <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-slate-700">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                              {course.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {timeSlot && `${timeSlot.startTime}-${timeSlot.endTime}`}
                            </div>
                          </div>

                          <CourseCard course={course} onClick={onCourseClick ?? undefined} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                    今天沒有課程
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ScheduleTable.displayName = 'ScheduleTable';