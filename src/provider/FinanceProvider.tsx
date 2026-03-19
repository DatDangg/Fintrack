import { useFinanceData } from "../hooks/useFinanceData";
import { FinanceContext } from "../lib/supabaseClient";

export const FinanceProvider = ({ children }: any) => {
    const finance = useFinanceData();

    return (
        <FinanceContext.Provider value={finance}>
            {children}
        </FinanceContext.Provider>
    );
};