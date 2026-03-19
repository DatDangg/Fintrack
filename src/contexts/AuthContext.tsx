import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user khi reload
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email || "",
                    name: data.user.user_metadata?.name || ""
                });
            }
            setIsLoading(false);
        };

        getUser();

        // Listen auth change
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata?.name || ""
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
    };

    const register = async (name: string, email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};