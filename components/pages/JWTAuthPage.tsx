import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Role } from '../../types';
import { DEMO_USERS } from '../../constants';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sun,
    Moon,
    ArrowRight,
    Zap,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    LogIn,
    UserPlus,
    BookOpen,
    Briefcase,
    User
} from 'lucide-react';

interface Props {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const JWTAuthPage: React.FC<Props> = ({ isDarkMode, onToggleTheme }) => {
    const navigate = useNavigate();
    const { login, signup, demoLogin } = useAuth();

    const [authMode, setAuthMode] = useState<'demo' | 'jwt'>('jwt');
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [signupRole, setSignupRole] = useState<'student' | 'faculty'>('student');

    // Common fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Student specific fields
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [studentDepartment, setStudentDepartment] = useState('');

    // Faculty specific fields
    const [facultyDepartment, setFacultyDepartment] = useState('');
    const [designation, setDesignation] = useState('');

    const handleJWTSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || !name) {
            setError('Please enter all required fields.');
            return;
        }

        if (formType === 'signup') {
            if (signupRole === 'student') {
                if (!enrollmentNumber || !studentDepartment) {
                    setError('Please fill in all required student fields.');
                    return;
                }
            } else if (signupRole === 'faculty') {
                if (!facultyDepartment || !designation) {
                    setError('Please fill in all required faculty fields.');
                    return;
                }
            }
        }

        setIsLoading(true);
        try {
            if (formType === 'login') {
                await login({ email, password });
            } else {
                const signupData = {
                    name,
                    email,
                    password,
                    globalRole: signupRole === 'student' ? 'Student' : 'Faculty',
                    enrollmentNumber: signupRole === 'student' ? enrollmentNumber : undefined,
                    department: signupRole === 'student' ? studentDepartment : facultyDepartment,
                    designation: signupRole === 'faculty' ? designation : undefined,
                };
                await signup(signupData);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (email: string) => {
        setError(null);
        setIsLoading(true);
        try {
            await demoLogin(email);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Demo login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full flex overflow-hidden transition-colors duration-700 bg-[var(--bg-main)]">

            {/* Animated Mesh Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/50'}`} />
                <div className={`absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-100/40'}`} />
            </div>

            {/* Theme Toggle */}
            <button
                onClick={onToggleTheme}
                className={`fixed top-8 right-8 z-50 p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white/80 border-slate-200 text-slate-600 hover:shadow-xl'}`}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Main Content Split */}
            <div className="relative z-10 w-full flex flex-col lg:flex-row">

                {/* Left Side: Branding & Hero */}
                <div className="hidden lg:flex flex-col justify-between w-[45%] p-20">
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-10 duration-700">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 rotate-12">
                            <Zap size={24} className="fill-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-[var(--text-main)]">
                            CLIX<span className="text-blue-500">HUB</span>
                        </h1>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                                <Sparkles size={14} />
                                Campus Management v2.0
                            </div>
                            <h2 className="text-7xl font-black leading-[0.9] tracking-tighter text-[var(--text-main)]">
                                Your Campus <br />
                                Command <span className="text-blue-500">Center</span>
                            </h2>
                            <p className="text-xl font-medium max-w-md leading-relaxed text-[var(--text-secondary)]">
                                Centralized platform for student clubs, events, and institutional management powered by secure JWT authentication.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-[var(--text-main)]">45+</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Active Clubs</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-[var(--text-main)]">12k</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Verified Users</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500/50 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} /> Secure JWT Authentication
                    </p>
                </div>

                {/* Right Side: Auth Component */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
                    <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-700">

                        {/* Mode Switcher Tabs */}
                        <div className={`flex rounded-2xl p-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <button
                                onClick={() => setAuthMode('jwt')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${authMode === 'jwt'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                JWT Auth
                            </button>
                            <button
                                onClick={() => { setAuthMode('demo'); setError(null); }}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${authMode === 'demo'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Demo Preview
                            </button>
                        </div>

                        {/* ─── JWT AUTH MODE ─────────────────────────────────────────────── */}
                        {authMode === 'jwt' && (
                            <div className="space-y-4">
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
                                        {formType === 'login' ? 'Welcome Back' : 'Join CLIX HUB'}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {formType === 'login' ? 'Sign in with your credentials' : 'Create a new account to get started'}
                                    </p>
                                </div>

                                {/* Login / Signup Toggle */}
                                <div className={`flex rounded-xl p-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                    <button
                                        onClick={() => { setFormType('login'); setError(null); }}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formType === 'login' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white text-[#1B2559] shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                                            }`}
                                    >
                                        <LogIn size={13} /> Login
                                    </button>
                                    <button
                                        onClick={() => { setFormType('signup'); setError(null); }}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formType === 'signup' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white text-[#1B2559] shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                                            }`}
                                    >
                                        <UserPlus size={13} /> Sign Up
                                    </button>
                                </div>

                                {/* Error Banner */}
                                {error && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
                                        <AlertCircle size={16} className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleJWTSubmit} className="space-y-3">
                                    {/* Role Selection (Signup Only) */}
                                    {formType === 'signup' && (
                                        <div className="flex gap-2 rounded-xl p-1 bg-slate-100/10 border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setSignupRole('student')}
                                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${signupRole === 'student'
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <BookOpen size={12} /> Student
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSignupRole('faculty')}
                                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${signupRole === 'faculty'
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <Briefcase size={12} /> Faculty
                                            </button>
                                        </div>
                                    )}

                                    {/* Name Field (Signup Only) */}
                                    {formType === 'signup' && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Full Name *"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                    : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                    }`}
                                            />
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder={formType === 'signup' && signupRole === 'student' ? 'Institute Email *' : formType === 'signup' && signupRole === 'faculty' ? 'Faculty Email *' : 'Email'}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                }`}
                                        />
                                    </div>

                                    {/* Student-specific fields */}
                                    {formType === 'signup' && signupRole === 'student' && (
                                        <>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enrollment Number *"
                                                    value={enrollmentNumber}
                                                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                        : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                        }`}
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Department *"
                                                    value={studentDepartment}
                                                    onChange={(e) => setStudentDepartment(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                        : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                        }`}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Faculty-specific fields */}
                                    {formType === 'signup' && signupRole === 'faculty' && (
                                        <>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Department *"
                                                    value={facultyDepartment}
                                                    onChange={(e) => setFacultyDepartment(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                        : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                        }`}
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Designation (e.g., Assistant Professor) *"
                                                    value={designation}
                                                    onChange={(e) => setDesignation(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                        ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                        : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                        }`}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Password Field */}
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-3.5 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all text-sm font-medium ${isDarkMode
                                                ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10'
                                                : 'bg-white border-slate-200 text-[#1B2559] placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                                    >
                                        {isLoading ? 'Processing...' : formType === 'login' ? 'Sign In' : 'Create Account'}
                                        {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ─── DEMO MODE ─────────────────────────────────────────────────── */}
                        {authMode === 'demo' && (
                            <div className="space-y-3">
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight text-[var(--text-main)]">Demo Access</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Select a profile to preview the system</p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
                                        <AlertCircle size={16} className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {DEMO_USERS.map((user) => {
                                        const roleIcons: Record<string, string> = {
                                            [Role.STUDENT]: '🎓',
                                            [Role.FACULTY]: '🏢',
                                            [Role.DEAN]: '📜',
                                            [Role.SUPER_ADMIN]: '🛡️'
                                        };
                                        const roleColors: Record<string, string> = {
                                            [Role.STUDENT]: 'text-blue-500',
                                            [Role.FACULTY]: 'text-amber-500',
                                            [Role.DEAN]: 'text-purple-500',
                                            [Role.SUPER_ADMIN]: 'text-rose-500'
                                        };

                                        return (
                                            <button
                                                key={user.id}
                                                onClick={() => handleDemoLogin(user.email)}
                                                disabled={isLoading}
                                                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                                                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/50'
                                                    : 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-xl shadow-emerald-500/10'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50 group-hover:bg-emerald-50'}`}>
                                                    {roleIcons[user.globalRole] || '👤'}
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <p className="font-black text-[var(--text-main)] truncate">{user.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className={`text-xs font-bold uppercase tracking-widest truncate ${roleColors[user.globalRole]}`}>{user.globalRole}</p>
                                                        {user.enrollmentNumber && (
                                                            <p className="text-xs font-bold text-slate-400">{user.enrollmentNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <Zap size={16} className="text-emerald-500 fill-emerald-500" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JWTAuthPage;
