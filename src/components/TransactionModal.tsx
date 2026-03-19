import React from 'react';
import { useFormik } from 'formik';
import type { CategoryInterface } from '../pages/SummaryView';
import { Modal } from './Modal';
import { twMerge } from 'tailwind-merge';
import { formatNumber } from '../lib/utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Loader2 } from 'lucide-react';

interface TransactionModalProps {
    onClose: () => void;
    onSubmit: (values: any) => void;
    formData: {
        amount: string;
        category_id: number | undefined;
        description: string;
        type: 'income' | 'expense';
        date: string;
    };
    categories: CategoryInterface[];
    loading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    onClose,
    onSubmit,
    formData,
    categories,
    loading
}) => {
    const formik = useFormik({
        initialValues: formData,
        onSubmit: (values) => {
            onSubmit({
                ...values,
                amount: Number(values.amount.replace(/,/g, ""))
            });
        }
    });

    return (
        <Modal onClose={onClose} title="Giao dịch mới">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => {
                            const firstExpense = categories.find(c => c.type === 'expense');
                            formik.setValues({
                                ...formik.values,
                                type: 'expense',
                                category_id: firstExpense?.id || 0
                            });
                        }}
                        className={twMerge(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
                            formik.values.type === 'expense'
                                ? "bg-white text-rose-600 shadow-md"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                    >
                        Chi tiêu
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const firstExpense = categories.find(c => c.type === 'income');
                            formik.setValues({
                                ...formik.values,
                                type: 'income',
                                category_id: firstExpense?.id || 0
                            });
                        }}
                        className={twMerge(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
                            formik.values.type === 'income'
                                ? "bg-white text-blue-600 shadow-md"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                    >
                        Thu nhập
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Số tiền
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                inputMode="numeric"
                                name="amount"
                                value={formik.values.amount}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        'amount',
                                        formatNumber(e.target.value)
                                    )
                                }
                                placeholder="0"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-blue-500 transition-all text-3xl font-black text-slate-900 placeholder:text-slate-200"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                                VND
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Danh mục
                            </label>
                            <select
                                name="category_id"
                                value={formik.values.category_id}
                                onChange={(e) =>
                                    formik.setFieldValue("category_id", Number(e.target.value))
                                }
                                className="input-field appearance-none font-semibold cursor-pointer"
                            >
                                {categories
                                    .filter(c => c.type === formik.values.type)
                                    .map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Ngày
                            </label>

                            <DatePicker
                                selected={formik.values.date ? new Date(formik.values.date) : null}
                                onChange={(date: Date | null) => {
                                    formik.setFieldValue(
                                        "date",
                                        date ? date.toISOString().split("T")[0] : ""
                                    );
                                }}
                                dateFormat="dd/MM/yyyy"
                                className="input-field font-semibold w-full cursor-pointer"
                                placeholderText="Chọn ngày"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Ghi chú
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder="Ăn trưa, tiền điện..."
                            className="input-field font-semibold"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={twMerge(
                        "cursor-pointer w-full py-5 rounded-3xl font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-1",
                        loading && "opacity-60"
                    )}
                    disabled={loading}
                >
                    {loading && <Loader2 className="animate-spin" size={28} />}
                    Xác nhận lưu
                </button>
            </form>
        </Modal>
    );
};