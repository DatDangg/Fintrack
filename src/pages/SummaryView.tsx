import { format, subDays } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { CashFlowChart } from "../components/Chart/CashFlowChart";
import { ExpenseChart } from "../components/Chart/ExpenseChart";
import { CurrentTransaction } from "../components/CurrentTransaction";
import { ItemCard } from "../components/ItemCard";

import { useFinance } from "../lib/supabaseClient";
import { useState } from "react";
import { DateRangeTabs } from "../components/DateRangeTabs";

export interface TransactionInterface {
    id: number;
    type: "income" | "expense";
    amount: number;
    date: string;
    category_id: number;
    description?: string;
}

export interface CategoryInterface {
    id: number;
    name: string;
    type: "income" | "expense";
}

export const SummaryView = () => {
    const { transactions, categories, loading, error } = useFinance();

    const [range, setRange] = useState<{
        type: "week" | "month" | "year" | "custom";
        startDate: Date;
        endDate: Date;
    }>({
        type: "week",
        startDate: subDays(new Date(), 6),
        endDate: new Date()
    });

    const filteredTransactions = transactions.filter((t: TransactionInterface) => {
        const date = new Date(t.date);
        console.log(date)
        return date >= range.startDate && date <= range.endDate;
    });
    console.log(filteredTransactions)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // ✅ tổng thu / chi
    const totalIncome = filteredTransactions
        .filter((t: TransactionInterface) => t.type === "income")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t: TransactionInterface) => t.type === "expense")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    if (window.matchMedia('(max-width: 767.98px)').matches) {
        console.log('Small screen (sm or smaller)');
    }


    const getChartData = () => {
        const result: any[] = [];

        // 👉 WEEK (giữ nguyên 7 ngày)
        if (range.type === "week") {
            const current = new Date(range.startDate);

            while (current <= range.endDate) {
                const dateStr = format(current, "yyyy-MM-dd");

                const dayIncome = filteredTransactions
                    .filter((t: TransactionInterface) =>
                        t.type === "income" &&
                        format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                const dayExpense = filteredTransactions
                    .filter((t: TransactionInterface) =>
                        t.type === "expense" &&
                        format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                result.push({
                    name: format(current, "dd/MM"),
                    Income: dayIncome,
                    Expense: dayExpense
                });

                current.setDate(current.getDate() + 1);
            }
        }

        // 👉 MONTH (lọc ngày lẻ)
        if (range.type === "month") {
            const current = new Date(range.startDate);

            while (current <= range.endDate) {
                const dateStr = format(current, "yyyy-MM-dd");

                const dayIncome = filteredTransactions
                    .filter((t: TransactionInterface) =>
                        t.type === "income" &&
                        format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                const dayExpense = filteredTransactions
                    .filter((t: TransactionInterface) =>
                        t.type === "expense" &&
                        format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                result.push({
                    name: format(current, "dd/MM"),
                    Income: dayIncome,
                    Expense: dayExpense
                });

                current.setDate(current.getDate() + 1);
            }
        }

        // 👉 YEAR (gộp theo tháng)
        if (range.type === "year") {
            for (let m = 0; m < 12; m++) {
                const monthStart = new Date(range.startDate.getFullYear(), m, 1);
                const monthEnd = new Date(range.startDate.getFullYear(), m + 1, 0);

                const monthIncome = filteredTransactions
                    .filter((t: TransactionInterface) => {
                        const d = new Date(t.date);
                        return t.type === "income" && d >= monthStart && d <= monthEnd;
                    })
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                const monthExpense = filteredTransactions
                    .filter((t: TransactionInterface) => {
                        const d = new Date(t.date);
                        return t.type === "expense" && d >= monthStart && d <= monthEnd;
                    })
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                result.push({
                    name: `T${m + 1}`,
                    Income: monthIncome,
                    Expense: monthExpense
                });
            }
        }

        if (range.type === "custom") {
            const current = new Date(range.startDate);

            while (current <= range.endDate) {
                const dateStr = format(current, "yyyy-MM-dd");

                const dayIncome = filteredTransactions
                    .filter(
                        (t: TransactionInterface) =>
                            t.type === "income" &&
                            format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                const dayExpense = filteredTransactions
                    .filter(
                        (t: TransactionInterface) =>
                            t.type === "expense" &&
                            format(new Date(t.date), "yyyy-MM-dd") === dateStr
                    )
                    .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

                result.push({
                    name: format(current, "dd/MM"),
                    Income: dayIncome,
                    Expense: dayExpense
                });

                current.setDate(current.getDate() + 1);
            }
        }

        return result;
    };

    const chartData = getChartData();

    // ✅ expense chart
    const expenseData = categories
        .filter((c: CategoryInterface) => c.type === "expense")
        .map((c: CategoryInterface) => {
            const total = transactions
                .filter(
                    (t: TransactionInterface) =>
                        t.type === "expense" &&
                        t.category_id === c.id
                )
                .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

            return {
                name: c.name,
                value: total,
            };
        })
        .filter((item: any) => item.value > 0);



    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="mb-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tổng quan</h2>
                    <p className="text-sm text-slate-500">
                        Dữ liệu tài chính từ {" "}
                        <span className="font-bold">{format(range.startDate, "dd/MM/yyyy")}</span>
                        {" "} đến {" "}
                        <span className="font-bold">{format(range.endDate, "dd/MM/yyyy")}</span></p>
                </div>
                <DateRangeTabs setRange={setRange} />
            </div>
            <div className="flex flex-col md:block">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 order-2">
                    <ItemCard
                        icon={<ArrowUpRight size={24} className="text-blue-500" />}
                        title="Thu nhập"
                        amount={totalIncome}
                        color="blue"
                    />
                    <ItemCard
                        icon={<ArrowDownLeft size={24} className="text-red-500" />}
                        title="Chi tiêu"
                        amount={totalExpense}
                        color="red"
                    />
                    <ItemCard
                        icon={<Wallet size={24} className="text-blue-500" />}
                        title="Số dư"
                        amount={balance}
                        color="blue"
                        type="balance"
                    />
                </div>

                <div className="md:pt-8 md:pb-0 pb-8 pt-2 order-1">
                    <CashFlowChart data={chartData} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-4">
                    <CurrentTransaction data={transactions} />
                </div>
                <div className="lg:col-span-1">
                    <ExpenseChart data={expenseData} />
                    {/* <SavingGoal /> */}
                </div>
            </div>
        </div>
    );
};