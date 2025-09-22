import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getCurrentWeek, formatDate } from '../utils/timeUtils';

interface WeekSelectorProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  currentWeek,
  onWeekChange
}) => {
  const actualCurrentWeek = getCurrentWeek();
  const maxWeek = 20; // 假設一學期最多20週
  

  
  // 計算當前週的日期範圍
  const getWeekDateRange = (week: number) => {
    const semesterStart = new Date('2025-09-15'); // 學期開始日期（週一）
    const weekStart = new Date(semesterStart);
    weekStart.setDate(semesterStart.getDate() + (week - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 週日
    
    return {
      start: formatDate(weekStart),
      end: formatDate(weekEnd)
    };
  };
  
  const dateRange = getWeekDateRange(currentWeek);
  
  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      onWeekChange(currentWeek - 1);
    }
  };
  
  const handleNextWeek = () => {
    if (currentWeek < maxWeek) {
      onWeekChange(currentWeek + 1);
    }
  };
  
  const handleCurrentWeek = () => {
    onWeekChange(actualCurrentWeek);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* 上一週按鈕 */}
        <button
          onClick={handlePrevWeek}
          disabled={currentWeek <= 1}
          className="flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span className="text-sm font-medium">上一週</span>
        </button>
        
        {/* 週次信息 */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <Calendar size={16} className="text-blue-600 mr-2" />
            <span className="text-lg font-bold text-gray-800">
              第 {currentWeek} 週
            </span>
            {currentWeek === actualCurrentWeek && (
              <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                本週
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {dateRange.start} - {dateRange.end}
          </div>
          
          {/* 回到本週按鈕 */}
          {currentWeek !== actualCurrentWeek && (
            <button
              onClick={handleCurrentWeek}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              回到本週
            </button>
          )}
        </div>
        
        {/* 下一週按鈕 */}
        <button
          onClick={handleNextWeek}
          disabled={currentWeek >= maxWeek}
          className="flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-sm font-medium">下一週</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      {/* 週次進度條 */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>第1週</span>
          <span>第{maxWeek}週</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentWeek / maxWeek) * 100}%` }}
          />
        </div>
      </div>
      

    </div>
  );
};