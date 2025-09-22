import React from 'react';
import { TimeSlot } from '../types/schedule';
import { isCurrentTimePeriod } from '../utils/timeUtils';

interface TimeHeaderProps {
  timeSlots: TimeSlot[];
}

export const TimeHeader: React.FC<TimeHeaderProps> = ({ timeSlots }) => {
  return (
    <div className="bg-white border-r border-gray-200">
      {/* 表頭 */}
      <div className="h-12 flex items-center justify-center bg-blue-600 text-white font-medium text-sm">
        作息時間
      </div>
      
      {/* 時間段列表 */}
      {timeSlots.map((slot) => {
        const isCurrent = isCurrentTimePeriod(slot.period);
        
        return (
          <div
            key={slot.period}
            className={`
              min-h-[6rem] border-b border-gray-200 p-2 flex flex-col justify-center
              ${isCurrent ? 'bg-green-100 border-green-300' : 'bg-gray-50'}
            `}
          >
            <div className={`font-bold text-sm mb-1 ${
              isCurrent ? 'text-green-800' : 'text-gray-700'
            }`}>
              第{slot.period}節
            </div>
            <div className={`text-xs ${
              isCurrent ? 'text-green-600' : 'text-gray-500'
            }`}>
              {slot.startTime}
            </div>
            <div className={`text-xs ${
              isCurrent ? 'text-green-600' : 'text-gray-500'
            }`}>
              {slot.endTime}
            </div>
            {isCurrent && (
              <div className="text-xs font-bold text-green-600 mt-1">
                ⏰ 當前
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};