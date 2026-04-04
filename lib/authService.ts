import { User, Role } from '../types';

const API_BASE = 'http://127.0.0.1:4000/api';
const TOKEN_KEY = 'ccms_auth_token';
const USER_KEY = 'ccms_user';

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
    globalRole?: Role;
    enrollmentNumber?: string;
    department?: string;
    designation?: string;
}

class AuthService {
    private token: string | null = null;
    private user: User | null = null;

    constructor() {
        // Initialize from localStorage
        this.token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }
    }

    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data: AuthResponse = await response.json();
            this.setAuthData(data);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Sign up with name, email, and password
     */
    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...credentials,
                    globalRole: credentials.globalRole || Role.STUDENT,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Signup failed');
            }

            const data: AuthResponse = await response.json();
            this.setAuthData(data);
            return data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    /**
     * Demo login for testing
     */
    async demoLogin(email: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE}/auth/demo-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Demo login failed');
            }

            const data: AuthResponse = await response.json();
            this.setAuthData(data);
            return data;
        } catch (error) {
            console.error('Demo login error:', error);
            throw error;
        }
    }

    /**
     * Get current user info
     */
    async getMe(): Promise<User | null> {
        if (!this.token) return null;

        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                }
                return null;
            }

            const user: User = await response.json();
            this.user = user;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    /**
     * Logout and clear auth data
     */
    logout(): void {
        this.token = null;
        this.user = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    /**
     * Get current token
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * Get current user
     */
    getUser(): User | null {
        return this.user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.token && !!this.user;
    }

    /**
     * Check if user has admin role
     */
    isAdmin(): boolean {
        return this.user?.globalRole === Role.SUPER_ADMIN;
    }

    /**
     * Check if user is faculty
     */
    isFaculty(): boolean {
        return this.user?.globalRole === Role.FACULTY || this.user?.globalRole === Role.SUPER_ADMIN;
    }

    /**
     * Get authorization header
     */
    getAuthHeader(): HeadersInit {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Private: Set auth data
     */
    private setAuthData(data: AuthResponse): void {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
}

export const authService = new AuthService();
