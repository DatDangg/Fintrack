import { subDays } from "date-fns";
import { forwardRef, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = forwardRef<HTMLButtonElement, any>(
    ({ value, onClick }, ref) => (
        <button
            onClick={onClick}
            ref={ref}
            className="inline-flex w-[100px] justify-center items-center px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-white hover:bg-slate-50 whitespace-nowrap"
        >
            {value || "dd/mm/yyyy"}
        </button>
    )
);

CustomInput.displayName = "CustomInput";

export const DateRangeTabs = ({ setRange }: any) => {
    const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year" | "custom">("week");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        if (chartPeriod === "week") {
            setRange({
                type: "week",
                startDate: subDays(now, 6),
                endDate: now
            });
        }

        if (chartPeriod === "month") {
            setRange({
                type: "month",
                startDate: new Date(year, month, 1),
                endDate: new Date(year, month + 1, 0)
            });
        }

        if (chartPeriod === "year") {
            setRange({
                type: "year",
                startDate: new Date(year, 0, 1),
                endDate: new Date(year, 11, 31)
            });
        }
    }, [chartPeriod]);

    useEffect(() => {
        if (chartPeriod === "custom" && startDate && endDate) {
            const start_ = new Date(startDate);
            const end_ = new Date(endDate);
            setRange({
                type: "custom",
                startDate: new Date(start_.getFullYear(), start_.getMonth(), start_.getDate()),
                endDate: new Date(end_.getFullYear(), end_.getMonth(), end_.getDate(), 23, 59, 59)
            });
        }
    }, [startDate, endDate, chartPeriod]);

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    {(['week', 'month', 'year', 'custom'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setChartPeriod(p)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg cursor-pointer
                        ${chartPeriod === p
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500'
                                }`}
                        >
                            {p === 'week' ? 'Tuần' :
                                p === 'month' ? 'Tháng' :
                                    p === 'year' ? 'Năm' : 'Tùy chọn'}
                        </button>
                    ))}
                </div>
                {chartPeriod === "custom" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="text-slate-300 text-xs">→</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                )}
            </div>


        </div>
    );
};