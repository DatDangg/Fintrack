import { format, subDays } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { CashFlowChart } from "../components/Chart/CashFlowChart";
import { ExpenseChart } from "../components/Chart/ExpenseChart";
import { CurrentTransaction } from "../components/CurrentTransaction";
import { ItemCard } from "../components/ItemCard";

import { useFinance } from "../lib/supabaseClient";

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
    const {
        transactions,
        categories,
        loading,
        error
    } = useFinance();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // ✅ tổng thu / chi
    const totalIncome = transactions
        .filter((t: TransactionInterface) => t.type === "income")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const totalExpense: number = transactions
        .filter((t: TransactionInterface) => t.type === "expense")
        .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // ✅ last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, "yyyy-MM-dd");

        const dayIncome = transactions
            .filter(
                (t: TransactionInterface) =>
                    t.type === "income" &&
                    format(new Date(t.date), "yyyy-MM-dd") === dateStr
            )
            .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

        const dayExpense = transactions
            .filter(
                (t: TransactionInterface) =>
                    t.type === "expense" &&
                    format(new Date(t.date), "yyyy-MM-dd") === dateStr
            )
            .reduce((sum: number, t: TransactionInterface) => sum + t.amount, 0);

        return {
            name: format(date, "dd/MM"),
            Income: dayIncome,
            Expense: dayExpense,
        };
    });

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
            <div className="grid grid-cols-3 gap-6">
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

            <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="col-span-2 space-y-8">
                    <CashFlowChart data={last7Days} />
                    <CurrentTransaction data={transactions} />
                </div>

                <div className="space-y-8">
                    <ExpenseChart data={expenseData} />
                    {/* <SavingGoal /> */}
                </div>
            </div>
        </div>
    );
};