import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../lib/utils";

export interface CashFlowChartProps {
    data: {
        name: string;
        Income: number;
        Expense: number;
    }[];
}

export const CashFlowChart = ({
    data,
}: CashFlowChartProps) => {

    return (
        <div className="bg-white border border-slate-200/60 shadow-premium rounded-[24px] transition-all duration-300 p-8">
            <div className="flex items-center justify-between md:mb-8 mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">Biểu đồ dòng tiền</h3>
                    <p className="text-xs text-slate-400">Trực quan hóa thu chi trong giai đoạn đã chọn</p>
                </div>
                <div className="hidden md:flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-slate-500">Thu nhập</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="text-xs font-medium text-slate-500">Chi tiêu</span>
                    </div>
                </div>
            </div>

            <div className="md:hidden flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-slate-500">Thu nhập</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-slate-500">Chi tiêu</span>
                </div>
            </div>


            {/* chart */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                            dy={10}
                            tickFormatter={(value, index) => {
                                if (index % 2 !== 0) return "";
                                return value;
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                            formatter={(value: any, name: any) => {
                                const labelMap: any = {
                                    Income: "Thu",
                                    Expense: "Chi"
                                };
                                return [formatCurrency(value), labelMap[name] || name];
                            }}
                        />
                        <Area type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                        <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>

            </div>
        </div>
    )
}