import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService, LoginCredentials, SignupCredentials, AuthResponse } from './authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    demoLogin: (email: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isFaculty: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(authService.getUser());
    const [loading, setLoading] = useState(true);

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // If we have a token, verify it's still valid
                if (authService.isAuthenticated()) {
                    const currentUser = await authService.getMe();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
        } catch (error) {
            authService.logout();
            setUser(null);
            throw error;
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        try {
            const response = await authService.signup(credentials);
            setUser(response.user);
        } catch (error) {
            authService.logout();
            setUser(null);
            throw error;
        }
    };

    const demoLogin = async (email: string) => {
        try {
            const response = await authService.demoLogin(email);
            setUser(response.user);
        } catch (error) {
            authService.logout();
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAdmin = user?.globalRole === 'Super Admin';
    const isFaculty = user?.globalRole === 'Faculty' || user?.globalRole === 'Super Admin';

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: authService.isAuthenticated(),
        login,
        signup,
        demoLogin,
        logout,
        isAdmin,
        isFaculty,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
