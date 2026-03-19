import { History, LayoutDashboard, Settings, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group cursor-pointer ${isActive
            ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`;

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-40">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Wallet className="text-white w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                        FinTrack
                    </span>
                </div>

                <nav className="space-y-2">
                    <NavLink to="/" end className={navClass}>
                        <LayoutDashboard size={20} />
                        <span>Tổng quan</span>
                    </NavLink>

                    <NavLink to="/history" className={navClass}>
                        <History size={20} />
                        <span>Lịch sử</span>
                    </NavLink>

                    <NavLink to="/categories" className={navClass}>
                        <Settings size={20} />
                        <span>Danh mục</span>
                    </NavLink>
                </nav>
            </div>

            <div className="mt-auto p-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                        Mẹo nhỏ
                    </p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        Hãy đặt ngân sách cho từng danh mục để kiểm soát chi tiêu tốt hơn!
                    </p>
                </div>
            </div>
        </aside>
    );
};