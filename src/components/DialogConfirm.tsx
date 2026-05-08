import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const ConfirmDialog = ({
    open,
    title = "Xác nhận",
    description = "Bạn có chắc muốn thực hiện hành động này?",
    onCancel,
    onConfirm,
    loading
}: ConfirmDialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {description}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={onConfirm}
                        className={twMerge(
                            "px-4 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center justify-center gap-1",
                            loading && "opacity-60"
                        )}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Có
                    </button>
                </div>
            </div>
        </div>
    );
};