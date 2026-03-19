import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFinance } from "../../lib/supabaseClient";
import {
    addGoal,
    deleteGoal,
    updateGoal
} from "../../services/financeService";
import { COLORS } from "../Chart/ExpenseChart";
import { GoalModal } from "./GoalModals";

export const SavingGoal = () => {
    const { savingsGoals, refresh } = useFinance();

    const [showGoalModal, setShowGoalModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<any>(null);

    const handleGoalSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                target_amount: Number(values.target_amount),
                current_amount: Number(values.current_amount)
            };

            if (values.id) {
                await updateGoal(values.id, payload);
            } else {
                await addGoal(payload);
            }

            await refresh(); // 🔥 update toàn bộ app
            setShowGoalModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Xoá mục tiêu này?")) return;

        try {
            await deleteGoal(id);
            await refresh(); // 🔥 sync lại
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="shadow-premium rounded-[24px] p-8 bg-slate-900 text-white">
                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-lg">Mục tiêu tiết kiệm</h3>
                    <button
                        onClick={() => {
                            setSelectedGoal(null);
                            setShowGoalModal(true);
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl cursor-pointer"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {savingsGoals.map((goal: any) => {
                    const progress = Math.min(
                        100,
                        Math.round((goal.current_amount / goal.target_amount) * 100)
                    );

                    return (
                        <div key={goal.id} className="group">
                            <div className="flex justify-between text-sm my-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">
                                        {goal.name}
                                    </span>

                                    <div className="hidden group-hover:flex gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedGoal({
                                                    ...goal,
                                                    target_amount:
                                                        goal.target_amount.toString(),
                                                    current_amount:
                                                        goal.current_amount.toString()
                                                });
                                                setShowGoalModal(true);
                                            }}
                                            className="p-1 hover:text-blue-400 cursor-pointer"
                                        >
                                            <Edit2 size={12} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="p-1 hover:text-rose-400 cursor-pointer"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                <span className="font-bold">{progress}%</span>
                            </div>

                            <div className="w-full h-2 bg-white/10 rounded-full">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor: goal.color
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {showGoalModal && (
                <GoalModal
                    onClose={() => setShowGoalModal(false)}
                    onSubmit={handleGoalSubmit}
                    initialValues={selectedGoal}
                    COLORS={COLORS}
                />
            )}
        </>
    );
};