import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency } from "../../lib/utils"
import { PieChartIcon } from "lucide-react"

export interface ExpenseChartProps {
    data: {
        name: string;
        value: number;
    }[];
}

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const ExpenseChart = ({
    data
}: ExpenseChartProps) => {
    const totalExpense = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className="bg-white border border-slate-200/60 shadow-premium rounded-[24px] transition-all duration-300 p-8">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Phân bổ chi tiêu</h3>
            <div className="h-[240px] relative">
                {data.length > 0 ? (
                    <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                    {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} wrapperStyle={{ zIndex: 1000 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng chi</span>
                            <span className="text-xl font-extrabold text-slate-900">{formatCurrency(totalExpense)}</span>
                        </div>
                    </>
                ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-sm text-center"><PieChartIcon size={48} className="mb-2 opacity-20" />Chưa có dữ liệu</div>}
            </div>
        </div>
    )
}