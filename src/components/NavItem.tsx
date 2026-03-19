import { twMerge } from "tailwind-merge";

export interface NavItemProps {
    active: boolean;
    icon: any;
    label: string;
    onClick: () => void;
}

export const NavItem = ({
    active,
    icon,
    label,
    onClick,
}: NavItemProps) => {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group cursor-pointer",
                active
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <span className={twMerge("transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")}>
                {icon}
            </span>
            {label}
            {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
        </button>
    );
};