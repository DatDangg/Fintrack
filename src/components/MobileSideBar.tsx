import { History, LayoutDashboard, List, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MobileNav = () => {

    const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 cursor-pointer ${isActive
            ? "text-blue-600"
            : "text-slate-400 hover:text-slate-600"
        }`;
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 lg:hidden z-40 px-6 py-3 flex items-center justify-between">
            <NavLink to="/" end className={mobileNavClass}>
                <LayoutDashboard size={24} />
                <span>Tổng quan</span>
            </NavLink>
            <NavLink to="/history" className={mobileNavClass}>
                <History size={20} />
                <span>Lịch sử</span>
            </NavLink>

            <NavLink to="/categories" className={mobileNavClass}>
                <List size={20} />
                <span>Danh mục</span>
            </NavLink>

            <NavLink to="/setting" className={mobileNavClass}>
                <Settings size={20} />
                <span>Cài đặt</span>
            </NavLink>
        </nav>
    );
};
