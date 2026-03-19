import { ArrowRight } from "lucide-react"
import { TransactionItem } from "./TransactionItem"
import type { TransactionInterface } from "../pages/SummaryView"
import { useFinance } from "../lib/supabaseClient";
import { deleteTransaction } from "../services/financeService";
import { useState } from "react";
import { toast } from "react-toastify";
import { ConfirmDialog } from "./DialogConfirm";
import { useNavigate } from "react-router-dom";

interface CurrentTransactionProps {
    data: TransactionInterface[];
}

export const CurrentTransaction = ({
    data
}: CurrentTransactionProps) => {
    const { categories, refresh } = useFinance();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        try {
            setDeleting(true);

            await deleteTransaction(selectedId);
            await refresh();

            toast.success("Đã xoá giao dịch");
        } catch (err) {
            console.error(err);
            toast.error("Xoá thất bại");
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
            setSelectedId(null);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">Giao dịch gần đây</h3>
                    <button onClick={() => { navigate("/history") }} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                        Xem tất cả <ArrowRight size={16} />
                    </button>
                </div>
                <div className="space-y-3">
                    {data.slice(0, 5).map((t: TransactionInterface) => (
                        <TransactionItem
                            key={t.id}
                            transaction={t}
                            onDelete={() => handleDelete(t.id)}
                            categories={categories}
                        />
                    ))}
                </div>
            </div >
            <ConfirmDialog
                open={confirmOpen}
                title="Xoá giao dịch"
                description="Bạn có chắc muốn xoá giao dịch này không?"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedId(null);
                }}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </>
    )
}