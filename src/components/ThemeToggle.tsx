// 主題切換組件
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    {
      value: 'light',
      icon: <Sun className="w-4 h-4" />,
      label: '淺色模式'
    },
    {
      value: 'dark',
      icon: <Moon className="w-4 h-4" />,
      label: '深色模式'
    },
    {
      value: 'system',
      icon: <Monitor className="w-4 h-4" />,
      label: '跟隨系統'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
        {themes.map(({ value, icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${theme === value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-slate-100'
              }
            `}
            title={label}
          >
            <span className="flex items-center justify-center">
              {icon}
            </span>
            <span className="hidden sm:inline">{label}</span>
            {theme === value && (
              <div className="absolute inset-0 ring-2 ring-blue-500 rounded-md pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* 當前主題指示器 */}
      <div className="absolute -top-2 -right-2">
        <div className={`
          w-2 h-2 rounded-full
          ${resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-orange-500'}
        `} />
      </div>
    </div>
  );
};

// 簡化版本的主題切換按鈕
export const SimpleThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { toggleTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200
        bg-gray-100 dark:bg-slate-800
        text-gray-600 dark:text-gray-400
        hover:bg-gray-200 dark:hover:bg-slate-700
        ${className}
      `}
      title={resolvedTheme === 'dark' ? '切換到淺色模式' : '切換到深色模式'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};