import { twMerge } from "tailwind-merge";
import { formatCurrency } from "../lib/utils";

export interface ItemCardProps {
    icon: any,
    title: string,
    amount: number,
    color: string,
}

export const ItemCard = ({
    icon,
    title,
    amount,
    color
}: ItemCardProps) => {
    return (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 backdrop-blur-sm shadow-premium rounded-[24px] transition-all duration-300 p-6 group hover:border-blue-200 dark:hover:border-blue-500/30">
            <div className="flex items-center justify-between mb-6">
                <div className={twMerge(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
                    color === 'blue' ? "bg-blue-50 dark:bg-blue-500/10" : color === 'red' ? "bg-rose-50 dark:bg-rose-500/10" : color === 'green' ? "bg-green-50 dark:bg-green-500/10" : "bg-slate-50 dark:bg-slate-800"
                )}>
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
                <h4 className={twMerge(
                    "text-2xl font-black text-slate-900 dark:text-white",
                )}>{formatCurrency(amount)}</h4>
            </div>
        </div>
    )
}