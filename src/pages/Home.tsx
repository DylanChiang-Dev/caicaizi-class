import React, { useState } from 'react';
import { ScheduleTable } from '../components/ScheduleTable';
import { CourseModal } from '../components/CourseModal';
import { WeekSelector } from '../components/WeekSelector';
import { scheduleData } from '../data/scheduleData';
import { Course } from '../types/schedule';
import { getCurrentWeek, getCurrentDateString } from '../utils/timeUtils';
import { Clock, BookOpen, MapPin, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  
  const currentDate = getCurrentDateString();
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">菜菜子的課表</h1>
          <p className="text-gray-600 flex items-center justify-center">
            <Clock size={16} className="mr-2" />
            今天是 {currentDate}
          </p>
        </div>
        
        {/* 週次選擇器 */}
        <WeekSelector 
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
        />
        
        {/* 課表 */}
        <div className="w-full overflow-x-auto">
          <ScheduleTable
            courses={scheduleData.courses}
            timeSlots={scheduleData.timeSlots}
            currentWeek={currentWeek}
            onCourseClick={handleCourseClick}
          />
        </div>
        
        {/* 特殊說明 */}
        {scheduleData.specialNotes && scheduleData.specialNotes.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 特殊說明</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              {scheduleData.specialNotes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 統計信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {scheduleData.courses.length}
              </h3>
              <p className="text-gray-600 text-sm">總課程數</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <MapPin className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {new Set(scheduleData.courses.map(c => c.classroom)).size}
              </h3>
              <p className="text-gray-600 text-sm">使用教室</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                第 {currentWeek} 週
              </h3>
              <p className="text-gray-600 text-sm">當前週次</p>
            </div>
          </div>
        </div>

        {/* 學期進度統計 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">學期進度統計</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 已上課時數 */}
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">已上課時數</p>
                <p className="text-lg font-bold text-green-800">
                  {formatTime(semesterProgress.completedMinutes)}
                </p>
              </div>
            </div>
            
            {/* 剩餘課時 */}
            <div className="flex items-center p-4 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-orange-600 font-medium">剩餘課時</p>
                <p className="text-lg font-bold text-orange-800">
                  {formatTime(semesterProgress.remainingMinutes)}
                </p>
              </div>
            </div>
            
            {/* 完成百分比 */}
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">完成進度</p>
                <p className="text-lg font-bold text-blue-800">
                  {semesterProgress.progressPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* 進度條 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>學期進度</span>
              <span>{formatTime(semesterProgress.totalMinutes)} 總課時</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${semesterProgress.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 課程詳情模態框 */}
        <CourseModal
          course={selectedCourse}
          timeSlots={scheduleData.timeSlots}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Home;