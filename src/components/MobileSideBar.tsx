import { History, LayoutDashboard, List, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MobileNav = () => {
    const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
        `flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 cursor-pointer text-xs font-semibold ${isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`;

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 lg:hidden z-40 flex items-center justify-around px-2"
            style={{ 
                height: 'calc(68px + env(safe-area-inset-bottom))', 
                paddingBottom: 'env(safe-area-inset-bottom)' 
            }}
        >
            <NavLink to="/" end className={mobileNavClass}>
                <LayoutDashboard size={20} className="transition-transform duration-300" />
                <span className="text-[11px]">Tổng quan</span>
            </NavLink>
            <NavLink to="/history" className={mobileNavClass}>
                <History size={20} className="transition-transform duration-300" />
                <span className="text-[11px]">Lịch sử</span>
            </NavLink>

            <NavLink to="/categories" className={mobileNavClass}>
                <List size={20} className="transition-transform duration-300" />
                <span className="text-[11px]">Danh mục</span>
            </NavLink>

            <NavLink to="/setting" className={mobileNavClass}>
                <Settings size={20} className="transition-transform duration-300" />
                <span className="text-[11px]">Cài đặt</span>
            </NavLink>
        </nav>
    );
};
