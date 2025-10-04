import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import { initTimeSync, getTimeSyncStatus, syncTimeWithNetwork } from "@/utils/timeUtils";
import { SimpleThemeToggle } from "@/components/ThemeToggle";
import { Clock, Wifi, WifiOff, RefreshCw } from "lucide-react";

export default function App() {
  const [timeSyncStatus, setTimeSyncStatus] = useState(getTimeSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // 初始化時間同步
    const initSync = async () => {
      await initTimeSync();
      setTimeSyncStatus(getTimeSyncStatus());
    };

    initSync();

    // 每30分鐘重新同步一次
    const syncInterval = setInterval(async () => {
      await syncTimeWithNetwork();
      setTimeSyncStatus(getTimeSyncStatus());
    }, 30 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, []);

  // 手動同步時間
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncTimeWithNetwork();
      setTimeSyncStatus(getTimeSyncStatus());
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Router>
      {/* 頂部控制欄 */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-start pointer-events-none">
        {/* 主題切換按鈕 */}
        <div className="pointer-events-auto">
          <SimpleThemeToggle />
        </div>

        {/* 時間同步狀態指示器 */}
        <div className="pointer-events-auto">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            timeSyncStatus.isNetworkTime
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <Clock className="w-4 h-4" />
            {timeSyncStatus.isNetworkTime ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>網路時間</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>本地時間</span>
              </>
            )}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="ml-2 p-1 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              title="手動同步時間"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
