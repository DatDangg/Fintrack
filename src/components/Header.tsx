import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useFinance } from "../lib/supabaseClient";
import { addTransaction } from "../services/financeService";
import { TransactionModal } from "./TransactionModal";
import { toast } from "react-toastify";
import type { CategoryInterface } from "../pages/SummaryView";

export const Header = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { refresh, categories } = useFinance();

    const location = useLocation();

    const hour = new Date().getHours()
    const partOfDay = (5 < hour && hour < 12) ? "buổi sáng!" : (12 < hour && hour < 18) ? "buổi chiều!" : "buổi tối!"

    const titleMap: Record<string, string> = {
        "/": "Chào " + partOfDay,
        "/history": "Lịch sử giao dịch",
        "/categories": "Quản lý danh mục",
    };

    const title = titleMap[location.pathname] || "FinTrack";

    const handleSubmit = async (values: any) => {
        try {
            setSubmitting(true);
            await addTransaction(values);
            await refresh();

            toast.success("Thêm giao dịch thành công");
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
            toast.error("Thêm giao dịch thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-30 bg-[#f8fafc]/80 backdrop-blur-xl border-b border-slate-200/60 border-none">
                <div className="max-w-6xl mx-auto px-4 py-4 h-20 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {title}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Hôm nay là{" "}
                            {format(new Date(), "EEEE, dd MMMM", {
                                locale: vi,
                            })}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Giao dịch mới</span>
                    </button>
                </div>
            </header>

            {showAddModal && (
                <TransactionModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleSubmit}
                    loading={submitting}
                    formData={{
                        amount: "",
                        category_id:
                            categories.find(
                                (c: CategoryInterface) => c.type === "expense"
                            )?.id || "",
                        description: "",
                        type: "expense",
                        date: format(new Date(), "yyyy-MM-dd"),
                    }}
                    categories={categories}
                />
            )}
        </>
    );
};