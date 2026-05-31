import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { DEMO_USERS } from '../../constants';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Zap, AlertCircle,
    Sparkles, ShieldCheck, LogIn, BookOpen, Briefcase, Hexagon,
    GraduationCap, Crown, UserCheck, Building2, Hash, ChevronDown
} from 'lucide-react';

/* ── Shared department / branch list ── */
const DEPARTMENTS = [
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Chemical Engineering',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Telecommunication Engineering',
    'Automobile Engineering',
    'Artificial Intelligence',
    'Artificial Intelligence & Data Science',
    'Artificial Intelligence & Machine Learning',
    'Computer Science & Design',
    'Computer Science & Business Systems',
    'Internet of Things',
    'Mathematics & Computing',
    'IT (AI & Robotics)',
    'Electrical Engineering (IoT)',
    'Computer Science & Technology',
];

interface Props {
    isDarkMode: boolean;
}

const JWTAuthPage: React.FC<Props> = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const { login, signup, demoLogin } = useAuth();

    const [authMode, setAuthMode] = useState<'demo' | 'jwt'>('jwt');
    const [formType, setFormType] = useState<'login' | 'signup'>('login');
    const [signupRole, setSignupRole] = useState<'student' | 'faculty'>('student');

    /* Common fields */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* Student-specific */
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    /* Faculty-specific */
    const [designation, setDesignation] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    /* ── Styled input / select classes (white bg, black text) ── */
    const inputClass =
        'w-full h-14 bg-white text-gray-900 border border-gray-200 rounded-2xl px-5 font-semibold text-sm ' +
        'focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-gray-400';
    const selectClass =
        'w-full h-14 bg-white text-gray-900 border border-gray-200 rounded-2xl px-5 pr-10 font-semibold text-sm ' +
        'focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer';

    const handleJWTSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formType === 'signup') {
            if (!name || !email || !password) { setError('Please fill all required fields.'); return; }
            if (signupRole === 'student' && !selectedBranch) { setError('Please select your branch.'); return; }
            if (signupRole === 'faculty' && (!designation || !selectedDepartment)) { setError('Please fill all faculty fields.'); return; }
        }
        setIsLoading(true);
        try {
            if (formType === 'login') {
                await login({ email, password });
            } else {
                const signupData: any = {
                    name,
                    email,
                    password,
                    globalRole: signupRole === 'student' ? 'Student' : 'Faculty',
                    enrollmentNumber: signupRole === 'student' ? enrollmentNumber : undefined,
                    branch: signupRole === 'student' ? selectedBranch : undefined,
                    department: signupRole === 'student' ? selectedBranch : selectedDepartment,
                    designation: signupRole === 'faculty' ? designation : undefined,
                };
                await signup(signupData);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (userEmail: string) => {
        setError(null);
        setIsLoading(true);
        try {
            await demoLogin(userEmail);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Demo login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex overflow-hidden bg-[var(--bg-main)] font-sans">

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 w-full flex flex-col lg:flex-row">

                {/* ─ HERO SIDE ─ */}
                <div className="hidden lg:flex lg:w-[40%] flex-col justify-between p-24 bg-primary-soft/30 border-r border-[var(--border-color)]">
                    <div className="flex items-center gap-4 reveal">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-3xl shadow-primary/40">
                            <Hexagon size={24} className="animate-spin-slow" />
                        </div>
                        <h1 className="text-2xl font-[1000] tracking-[-0.05em] uppercase italic">
                            CLIX<span className="text-primary">HUB</span>
                        </h1>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-6 reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.4em] text-primary">
                                <Sparkles size={14} /> Institutional Uplink
                            </div>
                            <h2 className="text-7xl font-[950] tracking-[-0.06em] leading-[0.85] text-[var(--text-main)]">
                                Command <br />
                                <span className="text-gradient animate-gradient italic px-2">Your Focus</span>
                            </h2>
                            <p className="text-xl font-medium text-[var(--text-secondary)] leading-relaxed max-w-sm">
                                The next generation of campus governance. Secure, integrated, and visually stunning.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-10 reveal" style={{ animationDelay: '0.4s' }}>
                            <div className="bento-card p-6 flex flex-col gap-2">
                                <span className="text-3xl font-black italic">45+</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50">Active Nodes</span>
                            </div>
                            <div className="bento-card p-6 flex flex-col gap-2">
                                <span className="text-3xl font-black italic">12k</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50">Pulse Users</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-30 reveal" style={{ animationDelay: '0.6s' }}>
                        <ShieldCheck size={16} /> AES-256 JWT Encryption Active
                    </div>
                </div>

                {/* ─ AUTH SIDE ─ */}
                <div className="flex-1 flex flex-col justify-center items-center p-5 md:p-8 lg:p-16 relative overflow-y-auto">
                    <div className="w-full max-w-lg space-y-8 reveal">

                        {/* Mode Selector */}
                        <div className="flex bg-primary-soft/50 p-1.5 rounded-[1.75rem] border border-[var(--border-color)]">
                            <button onClick={() => setAuthMode('jwt')}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-[10px] font-[900] uppercase tracking-[0.2em] transition-all ${authMode === 'jwt' ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}>
                                <LogIn className="inline-block mr-2" size={14} /> Gateway Access
                            </button>
                            <button onClick={() => setAuthMode('demo')}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-[10px] font-[900] uppercase tracking-[0.2em] transition-all ${authMode === 'demo' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}>
                                <Zap className="inline-block mr-2" size={14} /> Demo Uplink
                            </button>
                        </div>

                        {/* ── JWT AUTH PANEL ── */}
                        {authMode === 'jwt' ? (
                            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-7">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black tracking-tighter">
                                        {formType === 'login' ? 'System Login' : 'Create Node'}
                                    </h3>
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                                        {formType === 'login' ? 'Provide institutional credentials' : 'Register your institutional identity'}
                                    </p>
                                </div>

                                {/* Login / Signup tab row */}
                                <div className="flex gap-4 border-b border-[var(--border-color)] pb-4">
                                    {(['login', 'signup'] as const).map(t => (
                                        <button key={t} onClick={() => { setFormType(t); setError(null); }}
                                                className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all relative ${formType === t ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>
                                            {t === 'login' ? 'Authentication' : 'Registration'}
                                            {formType === t && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary rounded-full" />}
                                        </button>
                                    ))}
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleJWTSubmit} className="space-y-4">

                                    {/* ── SIGNUP EXTRAS ── */}
                                    {formType === 'signup' && (
                                        <>
                                            {/* Role Toggle */}
                                            <div className="flex gap-3 bg-primary-soft/30 p-1 rounded-2xl border border-[var(--border-color)]">
                                                <button type="button" onClick={() => setSignupRole('student')}
                                                        className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${signupRole === 'student' ? 'bg-primary text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}>
                                                    <BookOpen size={12} className="inline mr-2" /> Student
                                                </button>
                                                <button type="button" onClick={() => setSignupRole('faculty')}
                                                        className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${signupRole === 'faculty' ? 'bg-purple-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}>
                                                    <Briefcase size={12} className="inline mr-2" /> Faculty
                                                </button>
                                            </div>

                                            {/* Full Name */}
                                            <input type="text" placeholder="Full Name *" value={name}
                                                   onChange={e => setName(e.target.value)} required
                                                   className={inputClass} />

                                            {/* Faculty: Designation */}
                                            {signupRole === 'faculty' && (
                                                <input type="text" placeholder="Designation (e.g. Assistant Professor) *"
                                                       value={designation} onChange={e => setDesignation(e.target.value)} required
                                                       className={inputClass} />
                                            )}
                                        </>
                                    )}

                                    {/* Email */}
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                        <input type="email" placeholder="Institutional Email *" value={email}
                                               onChange={e => setEmail(e.target.value)} required
                                               className={`${inputClass} pl-12`} />
                                    </div>

                                    {/* ── STUDENT-ONLY extras ── */}
                                    {formType === 'signup' && signupRole === 'student' && (
                                        <>
                                            {/* Enrollment Number */}
                                            <div className="relative">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                                <input type="text" placeholder="Enrollment Number (e.g. 0901CS221001)"
                                                       value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)}
                                                       className={`${inputClass} pl-12`} />
                                            </div>

                                            {/* Branch Dropdown */}
                                            <div className="relative">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                                <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
                                                        required className={`${selectClass} pl-12`}>
                                                    <option value="">Select Branch *</option>
                                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {/* ── FACULTY-ONLY extras ── */}
                                    {formType === 'signup' && signupRole === 'faculty' && (
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
                                                    required className={`${selectClass} pl-12`}>
                                                <option value="">Select Department *</option>
                                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {/* Password */}
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} />
                                        <input type={showPassword ? 'text' : 'password'}
                                               placeholder="Password *" value={password}
                                               onChange={e => setPassword(e.target.value)} required
                                               className={`${inputClass} pl-12 pr-12`} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                            className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2">
                                        {isLoading ? 'Processing...' : formType === 'login' ? 'Initiate Link' : 'Register Node'}
                                        {!isLoading && <ArrowRight size={16} />}
                                    </button>
                                </form>
                            </div>

                        ) : (
                            /* ── DEMO UPLINK PANEL ── */
                            <div className="bento-card p-6 md:p-10 space-y-6 md:space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black tracking-tighter">Demo Uplink</h3>
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">Click any identity to instantly access the dashboard</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                                    {([
                                        { user: DEMO_USERS[0], icon: GraduationCap, gradient: 'from-blue-600/20 to-cyan-600/10', iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-500', badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10', hoverBorder: 'hover:border-blue-500/50', arrowColor: 'text-blue-500', desc: 'Student dashboard · Events · Clubs · Certificates' },
                                        { user: DEMO_USERS[1], icon: Briefcase, gradient: 'from-amber-500/20 to-orange-500/10', iconBg: 'bg-amber-500/10 border-amber-500/20', iconColor: 'text-amber-500', badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10', hoverBorder: 'hover:border-amber-500/50', arrowColor: 'text-amber-500', desc: 'Faculty panel · Oversight · Event approvals' },
                                        { user: DEMO_USERS[2], icon: UserCheck, gradient: 'from-purple-600/20 to-violet-600/10', iconBg: 'bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-400', badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10', hoverBorder: 'hover:border-purple-500/50', arrowColor: 'text-purple-400', desc: 'Dean portal · Policy governance · Final approvals' },
                                        { user: DEMO_USERS[3], icon: Crown, gradient: 'from-rose-600/20 to-pink-600/10', iconBg: 'bg-rose-500/10 border-rose-500/20', iconColor: 'text-rose-400', badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10', hoverBorder: 'hover:border-rose-500/50', arrowColor: 'text-rose-400', desc: 'Super Admin · Full system control · All features' },
                                    ] as const).map(({ user, icon: Icon, gradient, iconBg, iconColor, badgeColor, hoverBorder, arrowColor, desc }, i) => (
                                        <button key={user.id} onClick={() => handleDemoLogin(user.email)} disabled={isLoading}
                                                className={`group text-left p-5 rounded-2xl bg-gradient-to-r ${gradient} border border-[var(--border-color)] ${hoverBorder} hover:shadow-lg transition-all duration-300 flex items-center justify-between reveal disabled:opacity-60 disabled:cursor-not-allowed`}
                                                style={{ animationDelay: `${i * 0.07}s` }}>
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl border ${iconBg} ${iconColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                                    <Icon size={26} strokeWidth={2} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-black text-base tracking-tight leading-none">{user.name}</p>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${badgeColor}`}>{user.globalRole}</span>
                                                    </div>
                                                    <p className="text-[10px] font-semibold text-[var(--text-secondary)] tracking-wide">{desc}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className={`shrink-0 flex items-center gap-1 ${arrowColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}>
                                                <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Enter</span>
                                                <ArrowRight size={18} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-soft/30 border border-[var(--border-color)]">
                                    <ShieldCheck size={16} className="text-primary shrink-0" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">All demo sessions are isolated · No data is persisted · Safe to explore</p>
                                </div>
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] opacity-30">
                                Institutional Command Protocol v2.8.4-RELEASE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JWTAuthPage;
