import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.name) throw new Error('Vui lòng nhập tên');
                await register(formData.name, formData.email, formData.password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
                        <Wallet className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FinTrack</h1>
                    <p className="text-slate-500 mt-2">Quản lý tài chính cá nhân thông minh</p>
                </div>

                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`cursor-pointer flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`cursor-pointer flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Đăng ký
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Họ và tên</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="ml-2 text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};
