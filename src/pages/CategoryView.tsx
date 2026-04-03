import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryModal } from "../components/Modal/CategoryModal";
import { CategorySection } from "../components/CategorySection";

import { useFinance } from "../lib/supabaseClient";
import {
    addCategory,
    deleteCategory,
    updateCategory
} from "../services/financeService";
import type { CategoryInterface } from "./SummaryView";
import { ConfirmDialog } from "../components/DialogConfirm";
import { toast } from "react-toastify";

export const CategoryView = () => {
    const { refresh, categories, isInitialized } = useFinance();
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            if (values.id) {
                await updateCategory(values.id, values);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await addCategory(values);
                toast.success("Thêm danh mục thành công");
            }

            await refresh();
        } catch (err) {
            console.error(err);
            setSubmitting(false);
            toast.error("Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
            setShowModal(false);
        }
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setSubmitting(true);

        try {
            await deleteCategory(deleteId);
            toast.success("Đã xoá danh mục");
            await refresh();
        } catch (err) {
            console.error(err);
            setSubmitting(false);
            toast.error("Xoá thất bại");
        } finally {
            setSubmitting(false);
            setShowConfirm(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-slate-900">
                    Quản lý danh mục
                </h3>

                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all cursor-pointer"
                >
                    <Plus size={18} /> Thêm danh mục mới
                </button>
            </div>

            {!isInitialized ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium">Đang khởi tạo danh mục...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CategorySection
                        title="Danh mục Chi tiêu"
                        type="expense"
                        categories={(categories || []).filter((c: CategoryInterface) => c.type === "expense")}
                        onDelete={handleDelete}
                        onEdit={(category) => {
                            setSelectedCategory(category);
                            setShowModal(true);
                        }}
                    />

                    <CategorySection
                        title="Danh mục Thu nhập"
                        type="income"
                        categories={(categories || []).filter((c: CategoryInterface) => c.type === "income")}
                        onDelete={handleDelete}
                        onEdit={(category) => {
                            setSelectedCategory(category);
                            setShowModal(true);
                        }}
                    />

                    <CategorySection
                        title="Danh mục Vay nợ"
                        type="debt"
                        canChange={false}
                        categories={(categories || []).filter((c: CategoryInterface) => c.type === "debt")}
                        onDelete={handleDelete}
                        onEdit={(category) => {
                            setSelectedCategory(category);
                            setShowModal(true);
                        }}
                    />
                </div>
            )}

            {showModal && (
                <CategoryModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    initialValues={selectedCategory}
                    loading={submitting}
                />
            )}

            <ConfirmDialog
                open={showConfirm}
                title="Xoá danh mục"
                description="Bạn có chắc muốn xoá danh mục này"
                onCancel={() => {
                    setShowConfirm(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
                loading={submitting}
            />
        </div>
    );
};