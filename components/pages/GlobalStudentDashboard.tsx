import React, { useMemo, useState, useEffect } from 'react';
import { User, Event, Club, AuditLog, Registration, Applicant } from '../../types';
import { db } from '../../db';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    Calendar,
    CheckCircle2,
    TrendingUp,
    Wallet,
    Users,
    ArrowRight,
    MoreHorizontal,
    Clock,
    Activity,
    Zap,
    Ticket,
    Search,
    Bell,
    Sparkles,
    Shield,
    Layers
} from 'lucide-react';

interface Props {
    user: User;
    events: Event[];
    clubs: Club[];
    certCount: number;
    onRegister: (eventId: string) => void;
    isDarkMode: boolean;
    logs: AuditLog[];
    registrations: Registration[];
    applicants: Applicant[];
}

const GlobalStudentDashboard: React.FC<Props> = ({
    user, events, clubs, certCount, onRegister, isDarkMode, logs, registrations, applicants
}) => {
    const [savedEventIds, setSavedEventIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user?.id) return;
            const saved = await db.getSavedEvents(user.id);
            setSavedEventIds(saved.map(s => s.eventId));
        };
        fetchSaved();
    }, [user?.id]);

    const sparkData1 = [
        { val: 10 }, { val: 25 }, { val: 20 }, { val: 40 }, { val: 35 }, { val: 50 }, { val: 45 }, { val: 70 }
    ];
    const sparkData2 = [
        { val: 30 }, { val: 45 }, { val: 35 }, { val: 60 }, { val: 50 }, { val: 75 }, { val: 65 }, { val: 90 }
    ];
    const sparkData3 = [
        { val: 20 }, { val: 15 }, { val: 30 }, { val: 25 }, { val: 45 }, { val: 30 }, { val: 55 }, { val: 40 }
    ];

    const upcomingEvent = events.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="p-6 md:p-12 space-y-10 md:space-y-14 max-w-[1700px] mx-auto relative z-10">

            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Fleet Personnel Console</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-display leading-[0.9] text-[var(--text-main)]">
                        {getGreeting()}, <br className="md:hidden" />
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>
                    </h1>
                    <p className="text-[#A3AED0] font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                        Institutional Connectivity Active • {clubs.length} Club Nodes
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border glass-elevated`}>
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Global Rank</p>
                            <p className="font-black text-sm text-[var(--text-main)]">S-Tier Member</p>
                        </div>
                        <div className="w-px h-8 bg-slate-500/20" />
                        <Shield className="text-blue-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Metric Surfaces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {[
                    { label: 'Active Sessions', val: registrations.length, icon: Ticket, color: 'blue', data: sparkData1 },
                    { label: 'Verified Assets', val: certCount, icon: Zap, color: 'indigo', data: sparkData2 },
                    { label: 'Fleet Inquiries', val: applicants.length, icon: Layers, color: 'emerald', data: sparkData3 }
                ].map((metric, i) => (
                    <div key={i} className={`rounded-[3rem] p-8 md:p-10 border relative overflow-hidden group transition-all duration-700 glass-elevated hover:scale-[1.02]`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{metric.label}</p>
                                <h3 className={`text-4xl md:text-5xl font-black font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{metric.val}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl bg-${metric.color}-500/10 text-${metric.color}-500 shadow-xl shadow-${metric.color}-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
                                <metric.icon size={28} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metric.data}>
                                    <defs>
                                        <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={metric.color === 'blue' ? '#3b82f6' : metric.color === 'indigo' ? '#6366f1' : '#10b981'} stopOpacity={0.5} />
                                            <stop offset="100%" stopColor={metric.color === 'blue' ? '#3b82f6' : metric.color === 'indigo' ? '#6366f1' : '#10b981'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke={metric.color === 'blue' ? '#3b82f6' : metric.color === 'indigo' ? '#6366f1' : '#10b981'} strokeWidth={4} fill={`url(#grad-${i})`} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Core Timeline Area */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between px-4">
                        <h2 className={`text-2xl font-black tracking-tighter font-display ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>Strategic Timeline</h2>
                        <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors">Audit Full Schedule</button>
                    </div>

                    {upcomingEvent ? (
                        <div className={`p-10 md:p-14 rounded-[4rem] border relative overflow-hidden group glass-elevated`}>
                            <div className="absolute top-0 right-0 p-12 text-blue-500/5 transition-colors duration-700 group-hover:text-blue-500/10">
                                <Calendar size={180} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                                <div className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-2xl transition-transform duration-700 group-hover:scale-110 ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-[#1B2559] text-white shadow-black/20'
                                    }`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{new Date(upcomingEvent.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-4xl font-black leading-none">{new Date(upcomingEvent.date).getDate()}</span>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <span className="inline-block px-4 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] border border-blue-500/20">Critical Milestone</span>
                                        <h3 className={`text-3xl md:text-5xl font-black leading-[1.1] font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{upcomingEvent.title}</h3>
                                    </div>
                                    <p className="text-base font-medium text-slate-500 line-clamp-2 max-w-xl mx-auto md:mx-0 leading-relaxed font-sans">{upcomingEvent.description}</p>
                                    <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`w-10 h-10 rounded-2xl border-2 glass shadow-lg flex items-center justify-center ${isDarkMode ? 'border-white/10' : 'border-white'}`}>
                                                    <Users size={14} className="text-slate-400" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">1.2k+ Peers Activated</span>
                                    </div>
                                </div>
                                <button className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(59,130,146,0.3)] group-hover:translate-x-2">
                                    <ArrowRight size={32} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`p-20 rounded-[4rem] border border-dashed text-center glass-elevated ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}>
                            <Calendar size={60} className="mx-auto text-slate-500 mb-6 opacity-50" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Timeline Clear. No pending maneuvers.</p>
                        </div>
                    )}

                    {/* Omni-Actions Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Ticket, label: 'Access Passes', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                            { icon: CheckCircle2, label: 'Entry Scan', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { icon: Wallet, label: 'Fiscal Hub', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { icon: MoreHorizontal, label: 'Systems', color: 'text-blue-500', bg: 'bg-blue-500/10' }
                        ].map((action, i) => (
                            <button key={i} className={`p-8 rounded-[3rem] flex flex-col items-center justify-center gap-5 transition-all glass-elevated hover:scale-105 active:scale-95 group shadow-xl`}>
                                <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12`}>
                                    <action.icon size={24} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-[#1B2559]'}`}>{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Live System Feed */}
                <div className={`rounded-[4rem] p-10 border h-[750px] flex flex-col glass-elevated relative overflow-hidden group shadow-2xl`}>
                    {/* Background Accent */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1">
                            <h3 className={`text-xl font-black tracking-tighter font-display ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>Fleet Activity</h3>
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Real-time Node Status</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                            <Activity size={20} className="animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar relative z-10">
                        {logs.length > 0 ? logs.slice(0, 15).map((log, i) => (
                            <div key={i} className="flex gap-6 group/log">
                                <div className="flex flex-col items-center pt-2">
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === 0 ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6] scale-125' : 'bg-slate-700 shadow-none'}`} />
                                    <div className="w-[1.5px] h-full bg-gradient-to-b from-slate-700 via-slate-700/50 to-transparent my-2 group-last/log:hidden" />
                                </div>
                                <div className="pb-6">
                                    <p className={`text-xs font-bold leading-relaxed tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <span className="text-blue-500 font-black uppercase tracking-widest text-[10px] block mb-1">{log.user}</span>
                                        <span className="font-sans opacity-90">{log.action}</span>
                                    </p>
                                    <span className="text-[9px] font-black text-slate-500 mt-2 block uppercase tracking-widest">{log.timestamp}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                <Shield size={40} className="text-slate-500" />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Encryption Active • Monitoring...</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GlobalStudentDashboard;
