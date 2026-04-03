import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { History, X } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TransactionItem } from "../components/TransactionItem";


import { toast } from "react-toastify";
import { ConfirmDialog } from "../components/DialogConfirm";
import { useFinance } from "../lib/supabaseClient";
import { deleteTransaction } from "../services/financeService";
import type { TransactionInterface } from "./SummaryView";

export const HistoryView = () => {
    const { transactions, categories, loading } = useFinance();
    const { refresh } = useFinance();
    const [historyFilter, setHistoryFilter] = useState("all");
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

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


    if (loading) return <div>Loading...</div>;

    const filteredTransactions = transactions.filter((t: TransactionInterface) => {
        const date = format(new Date(t.date), "yyyy-MM-dd");

        const matchesType =
            historyFilter === "all" || t.type === historyFilter;
        const matchesStart = !startDate || date >= startDate;
        const matchesEnd = !endDate || date <= endDate;

        return matchesType && matchesStart && matchesEnd;
    });

    const groupedTransactions = filteredTransactions.reduce(
        (groups: any, t: TransactionInterface) => {
            const date = format(new Date(t.date), "yyyy-MM-dd");

            if (!groups[date]) groups[date] = [];
            groups[date].push(t);
            return groups;
        },
        {}
    );

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
        b.localeCompare(a)
    );

    return (
        <>
            <div className="space-y-6">
                {/* FILTER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex justify-center w-full items-center gap-3 p-1.5 bg-slate-200/50 rounded-[20px] md:w-fit">
                        {["all", "income", "expense"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setHistoryFilter(type)}
                                className={twMerge(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer",
                                    historyFilter === type
                                        ? type === "income" ? "bg-blue-100 text-blue-600 shadow-sm" :
                                            type === "expense" ? "bg-rose-100 text-rose-600 shadow-sm" : "bg-white shadow-sm text-slate-900"
                                        : type === "income" ? "hover:bg-blue-100 hover:text-blue-600 hover:shadow-sm" :
                                            type === "expense" ? "hover:bg-rose-100 hover:text-rose-600 hover:shadow-sm" : "hover:bg-white hover:text-slate-900 hover:shadow-sm"

                                )}
                            >
                                {type === "all"
                                    ? "Tất cả"
                                    : type === "income"
                                        ? "Thu nhập"
                                        : "Chi tiêu"}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200">

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="text-sm font-bold bg-transparent outline-none"
                            />

                            <span className="text-slate-300">→</span>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-sm font-bold bg-transparent outline-none"
                            />

                            {(startDate || endDate) && (
                                <button
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                    }}
                                    className="ml-2 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div className="space-y-10">
                    {sortedDates.map((date) => (
                        <div key={date} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-slate-200" />
                                <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    {format(new Date(date), "EEEE, dd/MM/yyyy", {
                                        locale: vi,
                                    })}
                                </div>
                                <div className="h-[1px] flex-1 bg-slate-200" />
                            </div>

                            <div className="space-y-3">
                                {groupedTransactions[date].map((t: any) => (
                                    <TransactionItem
                                        key={t.id}
                                        transaction={t}
                                        categories={categories}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {sortedDates.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold">
                                Không tìm thấy giao dịch nào
                            </p>
                            <p className="text-xs text-slate-300 mt-1">
                                Thử thay đổi bộ lọc hoặc khoảng thời gian
                            </p>
                        </div>
                    )}
                </div>
            </div>
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
    );
};