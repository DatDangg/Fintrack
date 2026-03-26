import { useAuth } from "../contexts/AuthContext";
import { useFinanceData } from "../hooks/useFinanceData";
import { FinanceContext } from "../lib/supabaseClient";

export const FinanceProvider = ({ children }: any) => {
    const { user } = useAuth();
    const finance = useFinanceData(user?.id);

    return (
        <FinanceContext.Provider value={finance}>
            {children}
        </FinanceContext.Provider>
    );
};