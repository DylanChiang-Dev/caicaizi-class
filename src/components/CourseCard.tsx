import React from 'react';
import { Course } from '../types/schedule';
import { isToday, isCurrentTimePeriod, getWeekTypeDisplay } from '../utils/timeUtils';

interface CourseCardProps {
  course: Course;
  onClick?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const isTodayCourse = isToday(course.dayOfWeek);
  const isCurrentTime = isTodayCourse && isCurrentTimePeriod(course.periods);
  
  // 根據課程類型設置不同顏色
  const getCardColor = () => {
    if (isCurrentTime) {
      return 'bg-green-100 border-green-400 text-green-800';
    }
    if (isTodayCourse) {
      return 'bg-blue-50 border-blue-300 text-blue-800';
    }
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };
  
  return (
    <div
      className={`
        h-full p-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col
        ${getCardColor()}
        ${onClick ? 'hover:scale-105' : ''}
      `}
      onClick={() => onClick?.(course)}
    >
      <div className="font-medium text-sm mb-1.5 leading-tight flex-shrink-0">
        <div className="truncate" title={course.name}>
          {course.name}
        </div>
      </div>
      
      <div className="text-xs space-y-1 flex-1 min-h-0">
        <div className="flex items-center min-w-0">
          <span className="font-medium text-gray-600 flex-shrink-0">教室</span>
          <span className="truncate ml-1 min-w-0" title={course.classroom}>{course.classroom}</span>
        </div>
        
        <div className="flex items-center min-w-0">
          <span className="font-medium text-gray-600 flex-shrink-0">節次</span>
          <span className="ml-1 truncate">{course.periods}</span>
        </div>
        

        
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-medium text-gray-600 flex-shrink-0">週次</span>
          <div className="flex gap-1 min-w-0 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              course.weekType === 'odd' ? 'bg-blue-100 text-blue-700' :
              course.weekType === 'even' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {getWeekTypeDisplay(course.weekType)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex-shrink-0">
              {course.weekRange || course.timePeriod || '1-18'}週
            </span>
          </div>
        </div>
      </div>
      
      {isCurrentTime && (
        <div className="mt-1.5 text-xs font-bold text-green-600 flex items-center">
          <span className="mr-1">🔥</span>
          <span>正在上課</span>
        </div>
      )}
    </div>
  );
};