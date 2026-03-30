import { format } from 'date-fns';

import { ArrowDownLeft, ArrowUpDown, ArrowUpRight, Calendar, Trash2 } from 'lucide-react';

import { twMerge } from 'tailwind-merge';
import { formatCurrency } from '../lib/utils';
import type { CategoryInterface } from '../pages/SummaryView';

interface TransactionItemProps {
    transaction: any;
    onDelete: (id: number) => void;
    categories: CategoryInterface[];
}

export const TransactionItem = ({
    transaction,
    onDelete,
    categories
}: TransactionItemProps) => {
    const category = categories?.find(c => c.id === transaction.category_id);

    const noId = categories.find((c: CategoryInterface) => c.name === "Vay")?.id;
    const traNoid = categories.find((c: CategoryInterface) => c.name === "Trả nợ")?.id;
    const choVayId = categories.find((c: CategoryInterface) => c.name === "Cho vay")?.id;
    const thuNoid = categories.find((c: CategoryInterface) => c.name === "Thu nợ")?.id;

    const sign = transaction.type === 'income' ? '+'
        : (transaction.category_id === noId || transaction.category_id === thuNoid) ? '+'
            : (transaction.category_id === traNoid || transaction.category_id === choVayId) ? '-'
                : '-';
    return (
        <div className="group flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-200/60 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="flex items-center gap-5" >
                <div className={twMerge(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    transaction.type === 'income' ? "bg-blue-50 text-blue-600" : transaction.type === 'expense' ? "bg-rose-50 text-rose-600" : "bg-green-50 text-green-600"
                )}>
                    {transaction.type === 'income' ? <ArrowUpRight size={24} /> : transaction.type === 'expense' ? <ArrowDownLeft size={24} /> : <ArrowUpDown size={24} />}
                </div>
                <div>
                    <div className="font-extrabold text-slate-900 text-lg">{category?.name}</div>
                    <div className="text-xs text-slate-400 font-bold flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(transaction.date, 'dd/MM/yyyy')}
                        </span>
                        {transaction.description && (
                            <div className='hidden md:block'>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span className="truncate max-w-[120px]">{transaction.description}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className={twMerge(
                    "text-xl font-black tracking-tight",
                    transaction.type === 'income' ? "text-blue-600" : transaction.type === 'expense' ? "text-rose-600" : "text-green-600"
                )}>
                    {sign}{formatCurrency(transaction.amount)}
                </div>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className={twMerge(
                        "p-2 text-slate-300  rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer",
                        transaction.type === 'income' ? "hover:text-blue-500 hover:bg-blue-50" : transaction.type === 'expense' ? "hover:text-rose-500 hover:bg-rose-50" : "hover:text-green-500 hover:bg-green-50"
                    )}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div >
    );
};
