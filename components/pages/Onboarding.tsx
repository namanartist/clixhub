
import React, { useState } from 'react';
import {
  Zap,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle
} from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
  onLogin: (email: string) => void;
  onSupabaseLogin: (email: string, password: string) => void;
  onSupabaseSignup: (email: string, password: string) => void;
}

const Onboarding: React.FC<Props> = ({ isDarkMode, onToggleTheme, onLogin, onSupabaseLogin, onSupabaseSignup }) => {
  const [authMode, setAuthMode] = useState<'demo' | 'supabase'>('demo');
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      if (formType === 'login') {
        await onSupabaseLogin(email, password);
      } else {
        await onSupabaseSignup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative h-screen w-full flex overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-[#02040a]' : 'bg-[#F4F7FE]'}`}>
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/50'}`} />
        <div className={`absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-100/40'}`} />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className={`fixed top-8 right-8 z-50 p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/ border-white/10 text-white hover:bg-white/' : 'bg-white/ border-slate-200 text-slate-600 hover:shadow-xl'}`}
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
            <h1 className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
              Campus<span className="text-blue-500">Os</span>
            </h1>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                <Sparkles size={14} />
                Institutional OS v2.0
              </div>
              <h2 className={`text-7xl font-black leading-[0.9] tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                Elevate your <br />
                Campus <span className="text-blue-500">Impact.</span>
              </h2>
              <p className={`text-xl font-medium max-w-md leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                The centralized operational hub for students, faculty, and administration. Empowering growth, one club at a time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <div className="space-y-1">
                <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>45+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Active Chapters</p>
              </div>
              <div className="space-y-1">
                <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>12k</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Verified Users</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-bold text-slate-500/50 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Secure Institutional Access Protocol
          </p>
        </div>

        {/* Right Side: Auth Component */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
          <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-700">

            {/* Mode Switcher Tabs */}
            <div className={`flex rounded-2xl p-1 ${isDarkMode ? 'bg-white/' : 'bg-slate-100'}`}>
              <button
                onClick={() => setAuthMode('demo')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  authMode === 'demo'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Demo Roles
              </button>
              <button
                onClick={() => { setAuthMode('supabase'); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                  authMode === 'supabase'
                    ? 'bg-[#3ECF8E] text-white shadow-lg shadow-emerald-500/30'
                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M21.362 9.354H12V20.379L21.362 9.354ZM2.638 14.646H12V3.621L2.638 14.646Z" />
                </svg>
                Supabase
              </button>
            </div>

            {/* ─── DEMO MODE ─────────────────────────────────────────────────── */}
            {authMode === 'demo' && (
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>Demo Access</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a role to preview the dashboard</p>
                </div>

                {/* Quick Launch */}
                <button
                  onClick={() => onLogin('demo-admin@mitsgwl.ac.in')}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 group"
                >
                  <Zap size={18} className="fill-white" />
                  Launch Demo User
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">or pick a role</span>
                  <div className="h-px flex-1 bg-white/" />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'Aryan Sharma', role: 'CSIT President', email: 'demo-student-001@mitsgwl.ac.in', icon: '🎓' },
                    { name: 'Dr. Priya Verma', role: 'Faculty Coordinator', email: 'demo-faculty-001@mitsgwl.ac.in', icon: '🏢' },
                    { name: 'Dr. Manish Dixit', role: 'DSW / Dean', email: 'demo-dean-001@mitsgwl.ac.in', icon: '🏛️' },
                    { name: 'System Admin', role: 'Super Admin', email: 'demo-admin@mitsgwl.ac.in', icon: '🛡️' }
                  ].map((user) => (
                    <button
                      key={user.email}
                      onClick={() => onLogin(user.email)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                        isDarkMode 
                        ? 'bg-white/ border-white/10 hover:bg-white/ hover:border-blue-500/50' 
                        : 'bg-whiteborder-slate-200 hover:border-blue-500/50 hover:shadow-xl shadow-blue-500/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDarkMode ? 'bg-white/' : 'bg-slate-50group-hover:bg-blue-50'}`}>
                        {user.icon}
                      </div>
                      <div className="text-left">
                        <p className={`font-black ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{user.name}</p>
                        <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest">{user.role}</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <Zap size={16} className="text-blue-500 fill-blue-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SUPABASE EMAIL/PASS MODE ───────────────────────────────────── */}
            {authMode === 'supabase' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
                    {formType === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {formType === 'login' ? 'Sign in with your Supabase account' : 'Sign up to create a new account'}
                  </p>
                </div>

                {/* Login / Signup Toggle */}
                <div className={`flex rounded-xl p-1 ${isDarkMode ? 'bg-white/' : 'bg-slate-100'}`}>
                  <button
                    onClick={() => { setFormType('login'); setError(null); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      formType === 'login' ? (isDarkMode ? 'bg-white/ text-white' : 'bg-whitetext-[#1B2559] shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                    }`}
                  >
                    <LogIn size={13} /> Login
                  </button>
                  <button
                    onClick={() => { setFormType('signup'); setError(null); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      formType === 'signup' ? (isDarkMode ? 'bg-white/ text-white' : 'bg-whitetext-[#1B2559] shadow-sm') : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
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
                <form onSubmit={handleSupabaseSubmit} className="space-y-3">
                  {/* Email */}
                  <div className="relative">
                    <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                      id="sb-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={`w-full pl-11 pr-4 py-4 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-[#3ECF8E]/50 ${
                        isDarkMode
                          ? 'bg-white/ border-white/10 text-white placeholder:text-slate-600 focus:border-[#3ECF8E]/50'
                          : 'bg-whiteborder-slate-200 text-[#1B2559] placeholder:text-slate-400 focus:border-[#3ECF8E]'
                      }`}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                      id="sb-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className={`w-full pl-11 pr-12 py-4 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-[#3ECF8E]/50 ${
                        isDarkMode
                          ? 'bg-white/ border-white/10 text-white placeholder:text-slate-600 focus:border-[#3ECF8E]/50'
                          : 'bg-whiteborder-slate-200 text-[#1B2559] placeholder:text-slate-400 focus:border-[#3ECF8E]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    id="sb-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#3ECF8E] text-white font-black uppercase tracking-widest transition-all duration-300 hover:bg-[#38b87d] hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : formType === 'login' ? (
                      <><LogIn size={18} /> Sign In</>
                    ) : (
                      <><UserPlus size={18} /> Create Account</>
                    )}
                  </button>
                </form>

                <p className={`text-center text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  Powered by{' '}
                  <span className="text-[#3ECF8E] font-black">Supabase</span>
                  {' '}— CampusOs Project ID:{' '}
                  <span className="font-mono">nktrhwpyaynmviwujumj</span>
                </p>
              </div>
            )}
          </div>

          <div className={`mt-6 text-center opacity-40`}>
            <p className={`text-[10px] font-bold tracking-wide leading-relaxed ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Access to CampusOs is restricted to authorized MITS personnel and students. <br />Use your official university credentials to proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
