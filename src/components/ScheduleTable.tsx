import React, { useState } from 'react';
import { Course, TimeSlot } from '../types/schedule';
import { DAY_NAMES, DayOfWeek } from '../types/schedule';
import { CourseCard } from './CourseCard';
import { TimeHeader } from './TimeHeader';
import { isToday, shouldShowCourse } from '../utils/timeUtils';

interface ScheduleTableProps {
  courses: Course[];
  timeSlots: TimeSlot[];
  currentWeek: number;
  onCourseClick?: (course: Course) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  courses,
  timeSlots,
  currentWeek,
  onCourseClick
}) => {
  // 工作日 (星期一到星期五)
  const weekdays = [1, 2, 3, 4, 5];
  
  // 根據星期和節次獲取課程（考慮週次過濾）
  const getCourseByDayAndPeriod = (dayOfWeek: number, period: string): Course | undefined => {
    return courses.find(course => 
      course.dayOfWeek === dayOfWeek && 
      course.periods === period &&
      shouldShowCourse(course.weekType, currentWeek, course.weekRange || course.timePeriod)
    );
  };
  
  // 過濾當前週次應該顯示的課程
  const getFilteredCourses = (dayOfWeek: number): Course[] => {
    return courses.filter(course => 
      course.dayOfWeek === dayOfWeek &&
      shouldShowCourse(course.weekType, currentWeek, course.weekRange || course.timePeriod)
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 桌面端表格佈局 */}
      <div className="hidden md:block overflow-x-auto">
        <div className="grid grid-cols-6 min-w-full">
          {/* 時間列 */}
          <TimeHeader timeSlots={timeSlots} />
          
          {/* 星期列 */}
          {weekdays.map(day => {
            const dayName = DAY_NAMES[day as DayOfWeek];
            const isTodayColumn = isToday(day);
            
            return (
              <div key={day} className="border-r border-gray-200 last:border-r-0">
                {/* 星期表頭 */}
                <div className={`
                  h-12 flex items-center justify-center font-medium text-sm border-b border-gray-200
                  ${isTodayColumn 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                  }
                `}>
                  {dayName}
                  {isTodayColumn && (
                    <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                      今天
                    </span>
                  )}
                </div>
                
                {/* 課程格子 */}
                {timeSlots.map(slot => {
                  const course = getCourseByDayAndPeriod(day, slot.period);
                  
                  return (
                    <div
                      key={`${day}-${slot.period}`}
                      className="h-32 border-b border-gray-200 p-1"
                    >
                      {course ? (
                        <CourseCard course={course} onClick={onCourseClick} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          無課程
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
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
                  : 'bg-gray-100 text-gray-700'
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
              <div className="border border-t-0 border-gray-200 rounded-b-lg">
                {dayCourses.length > 0 ? (
                  <div className="p-3 space-y-3">
                    {dayCourses.map(course => {
                      const timeSlot = timeSlots.find(slot => slot.period === course.periods);
                      
                      return (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm text-gray-800">
                              {course.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {timeSlot && `${timeSlot.startTime}-${timeSlot.endTime}`}
                            </div>
                          </div>
                          
                          <CourseCard course={course} onClick={onCourseClick} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400">
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
};