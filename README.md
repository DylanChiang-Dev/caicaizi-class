# 📚 課表網頁系統

一個現代化的課程表管理系統，支持單雙週課程顯示、響應式設計，為學生提供清晰直觀的課程安排查看體驗。

## ✨ 功能特性

### 📅 智能週次管理
- **單雙週課程支持**：自動識別並顯示單週、雙週或每週課程
- **週次切換**：可自由切換查看不同週次的課程安排
- **當前週次標識**：自動計算並高亮顯示當前週次
- **週次進度條**：直觀顯示學期進度

### 🎨 用戶界面
- **響應式設計**：完美適配桌面端和移動端
- **現代化UI**：採用Tailwind CSS，界面簡潔美觀
- **今日高亮**：自動標識今天的課程和時間
- **課程卡片**：豐富的課程信息展示

### 📊 課程管理
- **詳細課程信息**：包含課程名稱、教師、教室、節次等
- **課程統計**：顯示總課程數、使用教室數等統計信息
- **課程詳情模態框**：點擊課程查看詳細信息
- **特殊說明**：支持課程特殊安排說明

### ⏰ 時間管理
- **精確時間顯示**：準確的上課時間安排
- **當前時段標識**：自動識別當前正在進行的課程
- **作息時間對齊**：左側時間與右側課程完美對齊

## 🛠️ 技術棧

### 前端框架
- **React 18** - 現代化前端框架
- **TypeScript** - 類型安全的JavaScript
- **Vite** - 快速的構建工具

### UI 組件庫
- **Tailwind CSS** - 實用優先的CSS框架
- **Lucide React** - 精美的圖標庫
- **響應式設計** - 移動端優先的設計理念

### 開發工具
- **ESLint** - 代碼質量檢查
- **PostCSS** - CSS後處理器
- **pnpm** - 高效的包管理器

## 🚀 快速開始

### 環境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推薦) 或 npm >= 9.0.0

### 安裝依賴
```bash
# 使用 pnpm (推薦)
pnpm install

# 或使用 npm
npm install
```

### 啟動開發服務器
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

開發服務器將在 `http://localhost:5173` 啟動

### 構建生產版本
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

### 預覽生產版本
```bash
# 使用 pnpm
pnpm preview

# 或使用 npm
npm run preview
```

## 📁 項目結構

```
src/
├── components/          # React 組件
│   ├── CourseCard.tsx   # 課程卡片組件
│   ├── CourseModal.tsx  # 課程詳情模態框
│   ├── ScheduleTable.tsx # 課程表組件
│   ├── TimeHeader.tsx   # 時間表頭組件
│   └── WeekSelector.tsx # 週次選擇器
├── data/               # 數據文件
│   └── scheduleData.ts # 課程數據
├── hooks/              # 自定義 Hooks
│   └── useTheme.ts     # 主題管理
├── pages/              # 頁面組件
│   └── Home.tsx        # 主頁面
├── types/              # TypeScript 類型定義
│   └── schedule.ts     # 課程相關類型
├── utils/              # 工具函數
│   └── timeUtils.ts    # 時間處理工具
└── lib/                # 第三方庫配置
    └── utils.ts        # 通用工具函數
```

## 🎯 核心功能說明

### 週次過濾系統
系統支持三種課程類型：
- `all`: 每週都上的課程
- `odd`: 單週上課（第1、3、5...週）
- `even`: 雙週上課（第2、4、6...週）

### 響應式佈局
- **桌面端**：使用Grid佈局，展示完整的週課程表
- **移動端**：使用卡片佈局，按天顯示課程列表

### 時間計算
- 自動計算當前學期週次
- 支持自定義學期開始日期
- 智能識別當前時間段

## 🔧 配置說明

### 學期設置
在 `src/utils/timeUtils.ts` 中修改學期開始日期：
```typescript
const SEMESTER_START = new Date('2025-09-16');
```

### 課程數據
在 `src/data/scheduleData.ts` 中添加或修改課程信息：
```typescript
export const scheduleData: ScheduleData = {
  courses: [
    {
      id: '1',
      name: '課程名稱',
      teacher: '教師姓名',
      classroom: '教室',
      dayOfWeek: 1, // 1-7 代表週一到週日
      periods: '1-2', // 節次
      timePeriod: '1-15', // 週次範圍
      weekType: 'all', // 'all' | 'odd' | 'even'
      credits: 3,
      studentCount: 30
    }
  ],
  // ...
};
```

## 🤝 貢獻指南

1. Fork 本項目
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情

## 🙏 致謝

- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide](https://lucide.dev/) - 圖標庫
- [Vite](https://vitejs.dev/) - 構建工具

---

**開發者**: 課表網頁系統團隊  
**最後更新**: 2025年1月

如有問題或建議，歡迎提交 Issue 或 Pull Request！