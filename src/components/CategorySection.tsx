import { Edit2, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { CategoryInterface } from '../pages/SummaryView';


interface CategorySectionProps {
    title: string;
    type: 'income' | 'expense' | 'debt';
    categories: CategoryInterface[];
    onDelete: (id: number) => void;
    onEdit: (cat: CategoryInterface) => void;
}

export const CategorySection = ({
    title,
    type,
    categories,
    onDelete,
    onEdit
}: CategorySectionProps) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className={twMerge("w-2 h-6 rounded-full", type === 'expense' ? "bg-rose-500" : type === 'income' ? "bg-blue-500" : "bg-green-500")} />
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all"
                    >
                        <span className="font-bold text-slate-700">{c.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                                onClick={() => onEdit(c)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(c.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                        Chưa có danh mục nào
                    </div>
                )}
            </div>
        </div>
    );
};
