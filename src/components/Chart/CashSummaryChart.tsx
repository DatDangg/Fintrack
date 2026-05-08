import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { formatCurrency } from "../../lib/utils";

export interface CashSummaryChartProps {
    data: {
        name: string;
        Income: number;
        Expense: number;
    }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    const isUp = d.netFlow >= 0;
    const color = isUp ? "#16a34a" : "#dc2626";

    return (
        <div className="bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-[14px] p-3 text-xs min-w-[190px] shadow-xl">
            <p className="m-0 mb-2 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase">{label}</p>
            {[
                ["Thu nhập", formatCurrency(d.Income), "#16a34a"],
                ["Chi tiêu", formatCurrency(d.Expense), "#dc2626"],
            ].map(([lbl, val, c]) => (
                <div key={lbl as string} className="flex justify-between gap-4 my-1">
                    <span className="text-slate-400 dark:text-slate-500">{lbl}</span>
                    <span style={{ color: c as string }} className="font-bold">{val}</span>
                </div>
            ))}
            <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Dòng tiền ròng</span>
                <span style={{ color }} className="font-bold">
                    {isUp ? "▲ +" : "▼ "}{formatCurrency(Math.abs(d.netFlow))}
                </span>
            </div>
        </div>
    );
};

function zeroPercent(yMin: number, yMax: number): string {
    if (yMax <= 0) return "0%";
    if (yMin >= 0) return "100%";
    const pct = (yMax / (yMax - yMin)) * 100;
    return `${pct.toFixed(2)}%`;
}

export const CashSummaryChart = ({ data }: CashSummaryChartProps) => {
    const enriched = data.map((d) => ({
        ...d,
        netFlow: d.Income - d.Expense,
        volume: d.Income + d.Expense,
        isUp: d.Income - d.Expense >= 0,
    }));

    const allValues = enriched.map((d) => d.netFlow);
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const pad = (rawMax - rawMin) * 0.15 || 1000;
    const yMin = rawMin - pad;
    const yMax = rawMax + pad;
    const zeroPct = zeroPercent(yMin, yMax);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-premium rounded-[24px] transition-all duration-300 p-8">
            {/* Header — title only */}
            <div className="md:mb-8 mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Biểu đồ thu nhập</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Dòng tiền ròng (Thu nhập − Chi tiêu)</p>
            </div>

            {/* Main chart */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enriched}>
                        <defs>
                            <linearGradient id="strokeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={zeroPct} stopColor="#16a34a" stopOpacity={1} />
                                <stop offset={zeroPct} stopColor="#dc2626" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.22} />
                                <stop offset={zeroPct} stopColor="#16a34a" stopOpacity={0.03} />
                                <stop offset={zeroPct} stopColor="#dc2626" stopOpacity={0.03} />
                                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.22} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-[0.05]" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                            dy={10}
                            tickFormatter={(value, index) => (index % 2 !== 0 ? "" : value)}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                            domain={[yMin, yMax]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.4} />
                        <Area
                            type="monotone"
                            dataKey="netFlow"
                            stroke="url(#strokeGrad)"
                            strokeWidth={2.5}
                            fill="url(#fillGrad)"
                            fillOpacity={1}
                            dot={false}
                            activeDot={{ r: 5, fill: "#64748b", stroke: "white", strokeWidth: 2 }}
                            animationDuration={1200}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
