import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { getCurrentWeek, formatDate } from '../utils/timeUtils';
import { scheduleData } from '../data/scheduleData';

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
  
  // 計算學期進度統計
  const calculateSemesterProgress = () => {
    let totalMinutes = 0;
    let completedMinutes = 0;
    
    scheduleData.courses.forEach(course => {
      // 計算每節課的時長（分鐘）
      const timeSlot = scheduleData.timeSlots.find(slot => slot.period === course.periods);
      if (!timeSlot) return;
      
      const [startHour, startMin] = timeSlot.startTime.split(':').map(Number);
      const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      
      // 計算課程總週數
      let courseWeeks = maxWeek;
      if (course.weekRange) {
        const [start, end] = course.weekRange.split('-').map(Number);
        courseWeeks = end - start + 1;
      }
      
      // 根據週次類型調整
      if (course.weekType === 'odd') {
        courseWeeks = Math.ceil(courseWeeks / 2);
      } else if (course.weekType === 'even') {
        courseWeeks = Math.floor(courseWeeks / 2);
      }
      
      const courseTotalMinutes = durationMinutes * courseWeeks;
      totalMinutes += courseTotalMinutes;
      
      // 計算已完成的課時
      let completedWeeks = 0;
      const courseEndWeek = course.weekRange ? parseInt(course.weekRange.split('-')[1]) : maxWeek;
      const effectiveCurrentWeek = Math.min(actualCurrentWeek, courseEndWeek);
      
      if (course.weekType === 'odd') {
        // 單週課程
        for (let week = 1; week <= effectiveCurrentWeek; week += 2) {
          if (week <= courseEndWeek) completedWeeks++;
        }
      } else if (course.weekType === 'even') {
        // 雙週課程
        for (let week = 2; week <= effectiveCurrentWeek; week += 2) {
          if (week <= courseEndWeek) completedWeeks++;
        }
      } else {
        // 每週課程
        completedWeeks = Math.max(0, effectiveCurrentWeek);
        if (effectiveCurrentWeek > courseEndWeek) {
          completedWeeks = courseEndWeek;
        }
      }
      
      completedMinutes += durationMinutes * completedWeeks;
    });
    
    const remainingMinutes = totalMinutes - completedMinutes;
    const progressPercentage = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;
    
    return {
      totalMinutes,
      completedMinutes,
      remainingMinutes,
      progressPercentage
    };
  };
  
  // 將分鐘轉換為小時和分鐘的顯示格式
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小時${mins}分鐘`;
  };
  
  const semesterProgress = calculateSemesterProgress();
  
  // 計算當前週的日期範圍
  const getWeekDateRange = (week: number) => {
    const semesterStart = new Date('2025-09-16'); // 學期開始日期
    const weekStart = new Date(semesterStart);
    weekStart.setDate(semesterStart.getDate() + (week - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
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
      
      {/* 學期進度統計 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 已上課時數 */}
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-green-600 font-medium">已上課時數</p>
              <p className="text-sm font-bold text-green-800">
                {formatTime(semesterProgress.completedMinutes)}
              </p>
            </div>
          </div>
          
          {/* 剩餘課時 */}
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <div className="flex-shrink-0">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-orange-600 font-medium">剩餘課時</p>
              <p className="text-sm font-bold text-orange-800">
                {formatTime(semesterProgress.remainingMinutes)}
              </p>
            </div>
          </div>
          
          {/* 完成百分比 */}
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-blue-600 font-medium">完成進度</p>
              <p className="text-sm font-bold text-blue-800">
                {semesterProgress.progressPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* 進度條 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>學期進度</span>
            <span>{formatTime(semesterProgress.totalMinutes)} 總課時</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${semesterProgress.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};