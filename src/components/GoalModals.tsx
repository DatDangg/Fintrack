import React from 'react';
import { Modal } from './Modal';
import { formatNumber } from '../lib/utils';
import { twMerge } from 'tailwind-merge';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface GoalModalProps {
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues?: {
        id?: number | null;
        name: string;
        target_amount: string;
        current_amount: string;
        color: string;
    };
    COLORS: string[];
}

export const GoalModal: React.FC<GoalModalProps> = ({
    onClose,
    onSubmit,
    initialValues,
    COLORS
}) => {

    const formik = useFormik({
        initialValues: initialValues || {
            id: null,
            name: '',
            target_amount: '',
            current_amount: '',
            color: COLORS[0]
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Bắt buộc'),
            target_amount: Yup.string().required('Bắt buộc'),
            current_amount: Yup.string(),
            color: Yup.string().required()
        }),
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    return (
        <Modal onClose={onClose} title={formik.values.id ? 'Sửa mục tiêu' : 'Mục tiêu mới'}>
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                {/* NAME */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tên mục tiêu</label>
                    <input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className="input-field font-semibold"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
                    )}
                </div>

                {/* AMOUNT */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mục tiêu (VND)</label>
                        <input
                            name="target_amount"
                            inputMode="numeric"
                            value={formik.values.target_amount}
                            onChange={(e) =>
                                formik.setFieldValue("target_amount", formatNumber(e.target.value))
                            }
                            className="input-field font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hiện có (VND)</label>
                        <input
                            name="current_amount"
                            inputMode="numeric"
                            value={formik.values.current_amount}
                            onChange={(e) =>
                                formik.setFieldValue("current_amount", formatNumber(e.target.value))
                            }
                            className="input-field font-semibold"
                        />
                    </div>
                </div>

                {/* COLOR */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Màu sắc</label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => formik.setFieldValue("color", c)}
                                className={twMerge(
                                    "w-10 h-10 rounded-xl transition-all cursor-pointer",
                                    formik.values.color === c
                                        ? "ring-4 ring-slate-200 scale-110"
                                        : "hover:scale-105"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 cursor-pointer"
                >
                    Lưu mục tiêu
                </button>
            </form>
        </Modal>
    );
};