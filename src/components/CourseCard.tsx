import React from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Course } from '../types/schedule';
import { isToday, isCurrentTimePeriod, getWeekTypeDisplay } from '../utils/timeUtils';
import { cardHover } from '../utils/animations';

interface CourseCardProps {
  course: Course;
  onClick?: ((course: Course) => void) | undefined;
}

export const CourseCard: React.FC<CourseCardProps> = memo(({ course, onClick }) => {
  const isTodayCourse = isToday(course.dayOfWeek);
  const isCurrentTime = isTodayCourse && isCurrentTimePeriod(course.periods);

  // 根據課程類型設置不同顏色（支持暗黑模式）
  const getCardColor = () => {
    if (isCurrentTime) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200';
    }
    if (isTodayCourse) {
      return 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200';
    }
    return 'bg-gray-50 dark:bg-slate-700/30 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300';
  };

  return (
    <motion.div
      className={`
        w-full h-full p-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col
        ${getCardColor()}
      `}
      onClick={() => onClick?.(course)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={onClick ? cardHover.whileHover : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      layout
    >
      <div className="font-medium text-sm mb-1 leading-tight flex-shrink-0">
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
        
        <div className="flex items-start gap-1 min-w-0">
          <span className="font-medium text-gray-600 flex-shrink-0">週次</span>
          <div className="flex gap-1 min-w-0 flex-wrap">
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
              course.weekType === 'odd' ? 'bg-blue-100 text-blue-700' :
              course.weekType === 'even' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {getWeekTypeDisplay(course.weekType)}
            </span>
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 flex-shrink-0">
              {course.weekRange || course.timePeriod || '1-18'}週
            </span>
          </div>
        </div>
      </div>
      
      {isCurrentTime && (
        <div className="mt-1 text-xs font-bold text-green-600 flex items-center">
          <span className="mr-1">🔥</span>
          <span>正在上課</span>
        </div>
      )}
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';