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

    const handleLogoutSideEffect = () => {
        setUser(null);
        localStorage.clear();
    };

    // Load user khi reload
    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                handleLogoutSideEffect()
                setIsLoading(false);
                return;
            }

            setUser({
                id: data.user.id,
                email: data.user.email || "",
                name: data.user.user_metadata?.name || ""
            });

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
                handleLogoutSideEffect();
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        if (data.user) {
            setUser({
                id: data.user.id,
                email: data.user.email || "",
                name: data.user.user_metadata?.name || ""
            });
        }

    };

    const register = async (name: string, email: string, password: string) => {
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });
        if (data.user) {
            setUser({
                id: data.user.id,
                email: data.user.email || "",
                name: data.user.user_metadata?.name || ""
            });
        }

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