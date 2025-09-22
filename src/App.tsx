import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import { initTimeSync, getTimeSyncStatus } from "@/utils/timeUtils";
import { Clock, Wifi, WifiOff } from "lucide-react";

export default function App() {
  const [timeSyncStatus, setTimeSyncStatus] = useState(getTimeSyncStatus());

  useEffect(() => {
    // 初始化時間同步
    const initSync = async () => {
      await initTimeSync();
      setTimeSyncStatus(getTimeSyncStatus());
    };

    initSync();

    // 每30分鐘重新同步一次
    const syncInterval = setInterval(async () => {
      await initTimeSync();
      setTimeSyncStatus(getTimeSyncStatus());
    }, 30 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <Router>
      {/* 時間同步狀態指示器 */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          timeSyncStatus.isNetworkTime 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
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
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
