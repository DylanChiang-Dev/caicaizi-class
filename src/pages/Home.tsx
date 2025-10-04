import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScheduleTable } from '../components/ScheduleTable';
import { CourseModal } from '../components/CourseModal';
import { WeekSelector } from '../components/WeekSelector';
import { AnimatedContainer, AnimatedList } from '../components/AnimatedContainer';
import { scheduleData } from '../data/scheduleData';
import type { Course } from '../types/schedule';
import { getCurrentWeek, getCurrentDateString } from '../utils/timeUtils';
import {
  calculateSemesterProgress,
  formatDuration,
  getProgressStatus
} from '../utils/progressUtils';
import { animations } from '../utils/animations';
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

  // 使用 useMemo 優化進度計算
  const semesterProgress = useMemo(() => {
    return calculateSemesterProgress(scheduleData, actualCurrentWeek);
  }, [actualCurrentWeek]);

  
  const progressStatus = useMemo(() => {
    return getProgressStatus(semesterProgress.progressPercentage);
  }, [semesterProgress.progressPercentage]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <AnimatedContainer variant="slideIn" className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2"
            {...animations.pageTitle}
          >
            菜菜子的課表
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400 flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Clock size={16} className="mr-2" />
            今天是 {currentDate}
          </motion.p>
        </AnimatedContainer>
        
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
        <AnimatedList staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 p-4 flex items-center transition-colors duration-300"
            {...animations.statCard}
            whileHover={{
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {scheduleData.courses.length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">總課程數</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 p-4 flex items-center transition-colors duration-300"
            {...animations.statCard}
            whileHover={{
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <MapPin className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {new Set(scheduleData.courses.map(c => c.classroom)).size}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">使用教室</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 p-4 flex items-center transition-colors duration-300"
            {...animations.statCard}
            whileHover={{
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <Clock className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                第 {currentWeek} 週
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">當前週次</p>
            </div>
          </motion.div>
        </AnimatedList>

        {/* 學期進度統計 */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-black/20 p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">學期進度統計</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 已上課時數 */}
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">已上課時數</p>
                <p className="text-lg font-bold text-green-800">
                  {formatDuration(semesterProgress.completedMinutes)}
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
                  {formatDuration(semesterProgress.remainingMinutes)}
                </p>
              </div>
            </div>

            {/* 完成百分比 */}
            <div className={`flex items-center p-4 rounded-lg ${progressStatus.bgColor}`}>
              <div className="flex-shrink-0">
                <TrendingUp className={`w-6 h-6 ${progressStatus.color}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${progressStatus.color}`}>
                  {progressStatus.label}
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {semesterProgress.progressPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* 進度條 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>學期進度</span>
              <span>{formatDuration(semesterProgress.totalMinutes)} 總課時</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${semesterProgress.progressPercentage}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ originX: 0 }}
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