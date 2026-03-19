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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                    {description}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer"
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