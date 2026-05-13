import { Edit2, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { CategoryInterface } from '../pages/SummaryView';


interface CategorySectionProps {
    title: string;
    type: 'income' | 'expense' | 'debt';
    categories: CategoryInterface[];
    onDelete: (id: number) => void;
    onEdit: (cat: CategoryInterface) => void;
    canChange?: boolean
}

export const CategorySection = ({
    title,
    type,
    categories,
    onDelete,
    onEdit,
    canChange = true
}: CategorySectionProps) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <div className={twMerge("w-2 h-6 rounded-full", type === 'expense' ? "bg-rose-500" : type === 'income' ? "bg-blue-500" : "bg-green-500")} />
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md transition-all"
                    >
                        <span className="font-bold text-slate-700 dark:text-slate-300">{c.name}</span>
                        {canChange &&
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => onEdit(c)}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all cursor-pointer"
                                >
                                    <Edit2 size={16} />
                                </button>

                                <button
                                    onClick={() => onDelete(c.id)}
                                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>
                        }

                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-sm">
                        Chưa có danh mục nào
                    </div>
                )}
            </div>
        </div>
    );
};
