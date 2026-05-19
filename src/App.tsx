import "./App.css";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { useFinance } from "./lib/supabaseClient";
import { CategoryView } from "./pages/CategoryView";
import { HistoryView } from "./pages/HistoryView";
import { SummaryView } from "./pages/SummaryView";

import { Navigate, Route, Routes } from "react-router-dom";
import { AuthScreen } from "./components/AuthScreen";
import { useAuth } from "./contexts/AuthContext";
import { MobileNav } from "./components/MobileSideBar";
import { SettingView } from "./pages/SettingView";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { loading } = useFinance();
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }


  return (

    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-[100vh] pb-24 md:pb-8 transition-colors">
      <ToastContainer position="top-right" theme={theme} />
      <Sidebar />
      <MobileNav />
      <div className="lg:ml-64 transition-all duration-300">
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<SummaryView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/categories" element={<CategoryView />} />
            <Route path="/setting" element={<SettingView />} />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>

  );
}

export default App;