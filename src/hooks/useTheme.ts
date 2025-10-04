// 主題管理 Hook - 支持暗黑模式
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeConfig {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}

const THEME_KEY = 'caicaizi-theme';

export function useTheme(): ThemeConfig {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 從 localStorage 讀取保存的主題設置
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY) as Theme;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 檢測系統主題
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // 應用主題到 DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;

    let actualTheme: 'light' | 'dark';
    if (newTheme === 'system') {
      actualTheme = getSystemTheme();
    } else {
      actualTheme = newTheme;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    setResolvedTheme(actualTheme);
  }, [getSystemTheme]);

  // 設置主題
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // 切換主題
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // 初始化主題
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // 監聽系統主題變化
  useEffect(() => {
    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        applyTheme('system');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  };
} 