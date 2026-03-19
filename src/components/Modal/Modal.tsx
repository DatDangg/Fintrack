import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({
    onClose,
    title,
    children
}: ModalProps) => {
    return (
        <div className="fixed top-0 inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                <div className="p-8 pb-0 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-all active:scale-90 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};
