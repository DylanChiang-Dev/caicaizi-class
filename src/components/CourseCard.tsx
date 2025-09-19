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
        h-full p-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden
        ${getCardColor()}
        ${onClick ? 'hover:scale-105' : ''}
      `}
      onClick={() => onClick?.(course)}
    >
      <div className="font-medium text-xs mb-1 leading-tight truncate">
        {course.name}
      </div>
      
      <div className="text-xs space-y-0.5">
        {course.teacher && (
          <div className="flex items-center">
            <span className="font-medium">教師：</span>
            <span className="truncate">{course.teacher}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <span className="font-medium">教室：</span>
          <span className="truncate">{course.classroom}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium">節次：</span>
          <span>{course.periods}</span>
        </div>
        
        {course.studentCount && (
          <div className="flex items-center">
            <span className="font-medium">人數：</span>
            <span>{course.studentCount}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <span className="font-medium">週次：</span>
          <span className={`px-1.5 py-0.5 rounded text-xs ${
            course.weekType === 'odd' ? 'bg-blue-100 text-blue-700' :
            course.weekType === 'even' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {getWeekTypeDisplay(course.weekType)}
          </span>
        </div>
      </div>
      
      {isCurrentTime && (
        <div className="mt-1 text-xs font-bold text-green-600">
          🔥 正在上課
        </div>
      )}
    </div>
  );
};