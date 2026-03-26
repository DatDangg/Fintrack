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
        <div className="bg-white border border-slate-200/60 shadow-premium rounded-[24px] transition-all duration-300 p-6 group hover:border-blue-200">
            <div className="flex items-center justify-between mb-6">
                <div className={twMerge(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
                    color === 'blue' ? "bg-blue-50" : color === 'red' ? "bg-rose-50" : color === 'green' ? "bg-green-50" : "bg-slate-50"
                )}>
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <h4 className={twMerge(
                    "text-2xl font-black text-slate-900",
                )}>{formatCurrency(amount)}</h4>
            </div>
        </div>
    )
}