import React, { useState } from 'react';
import { ScheduleTable } from '../components/ScheduleTable';
import { CourseModal } from '../components/CourseModal';
import { WeekSelector } from '../components/WeekSelector';
import { scheduleData } from '../data/scheduleData';
import { Course } from '../types/schedule';
import { getCurrentWeek, getCurrentDateString } from '../utils/timeUtils';
import { Clock, BookOpen, MapPin } from 'lucide-react';

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
        <ScheduleTable
          courses={scheduleData.courses}
          timeSlots={scheduleData.timeSlots}
          currentWeek={currentWeek}
          onCourseClick={handleCourseClick}
        />
        
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