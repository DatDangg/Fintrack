import { format, subDays } from "date-fns";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CircleAlert, HandCoins } from "lucide-react";
import { CashFlowChart } from "../components/Chart/CashFlowChart";
import { ExpenseChart } from "../components/Chart/ExpenseChart";
import { CurrentTransaction } from "../components/CurrentTransaction";
import { ItemCard } from "../components/ItemCard";

import { useState } from "react";
import { CashSummaryChart } from "../components/Chart/CashSummaryChart";
import { DateRangeTabs } from "../components/DateRangeTabs";
import { useFinance } from "../lib/supabaseClient";

export interface TransactionInterface {
    id: number;
    type: "income" | "expense" | "debt";
    amount: number;
    date: string;
    category_id: number;
    description?: string;
}

export interface CategoryInterface {
    id: number;
    name: string;
    type: "income" | "expense" | "debt";
}

export const SummaryView = () => {
    const { transactions, categories, loading, error } = useFinance();
    const [isCashFlow, setIsCashFlow] = useState(true);
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
        const start_ = new Date(range.startDate.getFullYear(), range.startDate.getMonth(), range.startDate.getDate());
        const end_ = new Date(range.endDate.getFullYear(), range.endDate.getMonth(), range.endDate.getDate(), 23, 59, 59);

        return date >= start_ && date <= end_;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // ✅ tổng thu / chi
    const totalIncome = filteredTransactions
        .filter((t: TransactionInterface) => t.type === "income")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t: TransactionInterface) => t.type === "expense")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const sumByCategory = (categoryId: number) =>
        transactions
            .filter((t: TransactionInterface) => t.type === "debt" && t.category_id === categoryId)
            .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const noId = categories.find((c: CategoryInterface) => c.name === "Vay")?.id;
    const traNoid = categories.find((c: CategoryInterface) => c.name === "Trả nợ")?.id;
    const choVayId = categories.find((c: CategoryInterface) => c.name === "Cho vay")?.id;
    const thuNoid = categories.find((c: CategoryInterface) => c.name === "Thu nợ")?.id;

    const totalNo = sumByCategory(noId) - sumByCategory(traNoid);
    const totalChoVay = sumByCategory(choVayId) - sumByCategory(thuNoid);


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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 order-2">
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
                        icon={<HandCoins size={24} className="text-green-500" />}
                        title="Cho vay"
                        amount={totalChoVay}
                        color="green"
                    />
                    <ItemCard
                        icon={<CircleAlert size={24} className="text-green-500" />}
                        title="Nợ"
                        amount={totalNo}
                        color="green"
                    />
                </div>

                <div className="md:pt-8 md:pb-0 pb-8 pt-2 order-1 relative">
                    <ArrowLeftRight size={24} className="text-gray-500 mb-2 absolute top-16 right-8 cursor-pointer" onClick={() => setIsCashFlow(prev => !prev)} />
                    {isCashFlow ? <CashFlowChart data={chartData} /> : <CashSummaryChart data={chartData} />}
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