import { ChevronRight, HelpCircle, Info, LogOut, Moon, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingItem {
    title: string;
    items: {
        icon: React.ReactNode;
        label: string;
        sublabel?: string;
        color?: string;
        onClick?: () => void;
        isToggle?: boolean;
    }[]
}


export const SettingView = () => {
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth()

    const onLogout = async () => {
        await logout()
    }

    const settingsGroups: SettingItem[] = [
        {
            title: 'Tài khoản',
            items: [
                { icon: <User size={20} />, label: 'Thông tin cá nhân', sublabel: user?.name || 'Chưa cập nhật', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            ]
        },
        {
            title: 'Ứng dụng',
            items: [
                {
                    icon: theme === 'light' ? <Moon size={20} /> : <Sun size={20} />,
                    label: 'Giao diện',
                    sublabel: theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng',
                    color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                    onClick: toggleTheme,
                    isToggle: true
                },
            ]
        },
        {
            title: 'Hỗ trợ & Thông tin',
            items: [
                { icon: <HelpCircle size={20} />, label: 'Trợ giúp & Phản hồi', sublabel: 'Câu hỏi thường gặp', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
                { icon: <Info size={20} />, label: 'Về ứng dụng', sublabel: 'Phiên bản 1.0.0', color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
            ]
        }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cài đặt</h2>
            </div>

            <div className="space-y-6">
                {settingsGroups.map((group, groupIdx) => (
                    <motion.div
                        key={groupIdx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIdx * 0.1 }}
                        className="space-y-3"
                    >
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4">{group.title}</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            {group.items.map((item, itemIdx) => (
                                <button
                                    key={itemIdx}
                                    onClick={item.onClick}
                                    className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${itemIdx !== group.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.sublabel}</p>
                                        </div>
                                    </div>
                                    {item?.isToggle ? (
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    ) : (
                                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                >
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-3xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors active:scale-95 cursor-pointer"
                    >
                        <LogOut size={20} />
                        Đăng xuất
                    </button>
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-6 font-medium uppercase tracking-widest">
                        FinTrack &copy; 2026 &bull; Made with Love
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
