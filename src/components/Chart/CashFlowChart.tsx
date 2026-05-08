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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-premium rounded-[24px] transition-all duration-300 p-8">
            <div className="md:mb-8 mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Biểu đồ dòng tiền</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Trực quan hóa thu chi</p>
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
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-[0.05]" />
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
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                backgroundColor: 'var(--tooltip-bg, white)',
                                color: 'var(--tooltip-text, inherit)'
                            }}
                            className="dark:[--tooltip-bg:#1e293b] dark:[--tooltip-text:#f8fafc]"
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