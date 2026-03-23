import { supabase } from "../lib/supabaseClient";
import type { CategoryInterface } from "../pages/SummaryView";

/* TRANSACTIONS */

export async function getTransactions() {
    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function addTransaction(transaction: any) {
    const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select();

    if (error) throw error;
    return data;
}

export async function deleteTransaction(id: number) {
    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

/* CATEGORIES */

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("*");

    if (error) throw error;
    return data;
}

/* SAVINGS */

export async function getSavingsGoals() {
    const { data, error } = await supabase
        .from("savings_goals")
        .select("*");

    if (error) throw error;
    return data;
}


export async function addCategory(values: any) {
    const { id, ...payload } = values;

    const { data, error } = await supabase
        .from("categories")
        .insert([payload]);

    if (error) throw error;
    return data;
}

export async function updateCategory(id: number, data: CategoryInterface) {
    return supabase.from("categories").update(data).eq("id", id);
}

export async function deleteCategory(id: number) {
    return supabase.from("categories").delete().eq("id", id);
}

export async function addGoal(values: any) {
    const { id, ...payload } = values;

    const { data, error } = await supabase
        .from("savings_goals")
        .insert([payload]);

    if (error) throw error;
    return data;
}

export async function updateGoal(id: number, data: any) {
    return supabase.from("savings_goals").update(data).eq("id", id);
}

export async function deleteGoal(id: number) {
    return supabase.from("savings_goals").delete().eq("id", id);
}