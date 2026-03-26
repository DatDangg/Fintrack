import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

    // Flag để chặn onAuthStateChange set user trong lúc register đang chờ trigger
    const isRegisteringRef = useRef(false);

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
            // Bỏ qua nếu đang register — register() sẽ tự setUser sau khi trigger xong
            if (isRegisteringRef.current) return;

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
        isRegisteringRef.current = true;

        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name } },
            });

            if (error) throw error;

            // Set user ngay — navigate vào app ngay lập tức, không chờ trigger
            // useFinanceData sẽ tự refresh khi realtime báo categories đã sẵn sàng
            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email || "",
                    name: data.user.user_metadata?.name || "",
                });
            }
        } finally {
            isRegisteringRef.current = false;
        }
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