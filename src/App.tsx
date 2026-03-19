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

function App() {
  const { loading } = useFinance();
  const { user, isLoading: authLoading } = useAuth();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }


  return (

    <div className="bg-[#f8fafc] min-h-[100vh]">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<SummaryView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/categories" element={<CategoryView />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>

  );
}

export default App;