import React from 'react';
import { Modal } from './Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface CategoryModalProps {
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues?: {
        id?: number | null;
        name: string;
        type: 'income' | 'expense';
    };
    loading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    onClose,
    onSubmit,
    initialValues,
    loading
}) => {

    const formik = useFormik({
        initialValues: initialValues || {
            id: null,
            name: '',
            type: 'expense'
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Bắt buộc'),
            type: Yup.string().required()
        }),
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    return (
        <Modal onClose={onClose} title={formik.values.id ? 'Sửa danh mục' : 'Danh mục mới'}>
            <form onSubmit={formik.handleSubmit} className="space-y-6">

                {/* TYPE */}
                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => formik.setFieldValue('type', 'expense')}
                        className={twMerge(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
                            formik.values.type === 'expense'
                                ? "bg-white text-rose-600 shadow-md"
                                : "text-slate-500"
                        )}
                    >
                        Chi tiêu
                    </button>

                    <button
                        type="button"
                        onClick={() => formik.setFieldValue('type', 'income')}
                        className={twMerge(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer",
                            formik.values.type === 'income'
                                ? "bg-white text-blue-600 shadow-md"
                                : "text-slate-500"
                        )}
                    >
                        Thu nhập
                    </button>
                </div>

                {/* NAME */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tên danh mục</label>
                    <input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder="Ví dụ: Du lịch, Thưởng Tết..."
                        className="input-field font-semibold"
                    />

                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={twMerge(
                        "w-full py-4 rounded-2xl font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 cursor-pointer flex items-center justify-center gap-1",
                        loading && "opacity-60"
                    )}
                >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    Lưu
                </button>
            </form>
        </Modal>
    );
};