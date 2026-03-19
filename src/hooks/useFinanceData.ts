import { useEffect, useState, useCallback } from "react";
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

export function useFinanceData() {
  const [transactions, setTransactions] = useState<TransactionInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🚀 chạy song song
      const [t, c, s] = await Promise.all([
        getTransactions(),
        getCategories(),
        getSavingsGoals()
      ]);

      setTransactions(t || []);
      setCategories(c || []);
      setSavingsGoals(s || []);

      // 👉 derive data
      setStats(calculateStats(t || []));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    transactions,
    categories,
    savingsGoals,
    stats,
    loading,
    error,
    refresh: loadData
  };
}