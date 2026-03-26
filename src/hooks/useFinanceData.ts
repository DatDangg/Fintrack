import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import {
    getTransactions,
    getCategories,
    getSavingsGoals
} from "../services/financeService";
import type {
    TransactionInterface,
    CategoryInterface
} from "../pages/SummaryView";
import { calculateStats } from "../services/statsService";

export function useFinanceData(userId?: string) {
    const [transactions, setTransactions] = useState<TransactionInterface[]>([]);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // true khi đã fetch xong VÀ categories không rỗng (trigger đã chạy xong)
    const [isInitialized, setIsInitialized] = useState(false);

    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // silent = true → không set loading, refresh ngầm không làm UI giật
    const loadData = useCallback(async (silent = false) => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            if (!silent) setLoading(true);
            setError(null);

            const [t, c, s] = await Promise.all([
                getTransactions(),
                getCategories(),
                getSavingsGoals()
            ]);

            setTransactions(t || []);
            setCategories(c || []);
            setSavingsGoals(s || []);
            setStats(calculateStats(t || []));

            // Đánh dấu initialized khi categories đã có
            // (trigger đã chạy xong, data sẵn sàng)
            if (c && c.length > 0) setIsInitialized(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            if (!silent) setLoading(false);
        }
    }, [userId]);

    // Reset khi đổi user (logout / login tài khoản khác)
    useEffect(() => {
        setIsInitialized(false);
    }, [userId]);

    // Load data khi userId thay đổi (login / logout)
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Subscribe realtime — tự refresh khi trigger tạo xong categories
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`finance-init-${userId}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "categories",
                filter: `user_id=eq.${userId}`,
            }, () => {
                // Debounce — trigger tạo nhiều rows, chỉ cần fetch 1 lần sau khi xong
                if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = setTimeout(() => {
                    loadData(true); // silent — không hiện loading
                }, 300);
            })
            .subscribe();

        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            channel.unsubscribe();
        };
    }, [userId, loadData]);

    return {
        transactions,
        categories,
        savingsGoals,
        stats,
        loading,
        error,
        isInitialized,
        refresh: loadData
    };
}