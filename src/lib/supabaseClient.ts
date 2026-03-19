import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = VITE_SUPABASE_URL;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const FinanceContext = createContext<any>(null);

export const useFinance = () => useContext(FinanceContext);