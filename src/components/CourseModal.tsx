import React from 'react';
import { Course, TimeSlot } from '../types/schedule';
import { DAY_NAMES } from '../types/schedule';
import { X } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  timeSlots: TimeSlot[];
  isOpen: boolean;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  timeSlots,
  isOpen,
  onClose
}) => {
  if (!isOpen || !course) return null;
  
  const timeSlot = timeSlots.find(slot => slot.period === course.periods);
  const dayName = DAY_NAMES[course.dayOfWeek];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 標題欄 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">課程詳情</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* 課程內容 */}
        <div className="p-4 space-y-4">
          {/* 課程名稱 */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              {course.name}
            </h3>
          </div>
          
          {/* 基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">上課時間：</span>
              <span className="text-gray-600">
                {dayName} 第{course.periods}節
              </span>
            </div>
            
            {timeSlot && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">時間段：</span>
                <span className="text-gray-600">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">教室：</span>
              <span className="text-gray-600">{course.classroom}</span>
            </div>
            
            {course.studentCount && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">學生人數：</span>
                <span className="text-gray-600">{course.studentCount}人</span>
              </div>
            )}
          </div>
          
          {/* 課程描述 */}
          {course.description && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">課程描述：</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
          )}
          
          {/* 備註信息 */}
          {course.note && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-800 mb-1">備註：</h4>
              <p className="text-yellow-700 text-sm">
                {course.note}
              </p>
            </div>
          )}
        </div>
        
        {/* 底部按鈕 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};