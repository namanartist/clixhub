import React, { useMemo, useState, useEffect } from 'react';
import { User, Event, Club, AuditLog, Registration, Applicant } from '../../types';
import { db } from '../../db';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Calendar,
    CheckCircle2,
    Wallet,
    Users,
    ArrowRight,
    MoreHorizontal,
    Activity,
    Zap,
    Ticket,
    Sparkles,
    Shield,
    Layers,
    Hexagon,
    Terminal
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

    const sparkData = useMemo(() => [
        { val: 10 }, { val: 25 }, { val: 20 }, { val: 40 }, { val: 35 }, { val: 50 }, { val: 45 }, { val: 70 }
    ], []);

    const upcomingEvent = useMemo(() => 
        events.filter(e => new Date(e.date) > new Date())
             .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
        [events]
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="p-8 md:p-14 space-y-12 md:space-y-20 max-w-[1800px] mx-auto relative reveal">
            
            {/* ─── INSTITUTIONAL HEADER ─── */}
            <div className="flex flex-col lg:row-start-1 lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20">
                            <Hexagon size={28} className="animate-spin-slow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Operational Core</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Uplink Stable</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-8xl font-[950] tracking-[-0.06em] leading-[0.85] text-[var(--text-main)]">
                            {getGreeting()}, <br/>
                            <span className="text-gradient animate-gradient italic">{user.name.split(' ')[0]}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bento-card py-4 px-8 flex items-center gap-6 group hover:translate-y-0 hover:scale-100">
                        <div className="text-right">
                           <p className="text-[8px] font-black uppercase text-[var(--text-secondary)] tracking-[0.3em] mb-1">Global Tier</p>
                           <p className="text-lg font-black tracking-tight text-primary">S-Tier Member</p>
                        </div>
                        <div className="w-px h-10 bg-[var(--border-color)]" />
                        <Shield className="text-primary group-hover:scale-110 transition-transform" size={28} />
                    </div>
                </div>
            </div>

            {/* ─── LIVE METRIC GRID ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                    { label: 'Active Sessions', val: registrations.length, icon: Ticket, hue: 'var(--p-h)' },
                    { label: 'Verified Assets', val: certCount, icon: Zap, hue: 'var(--accent-purple)' },
                    { label: 'Fleet Applications', val: applicants.length, icon: Layers, hue: 'var(--accent-cyan)' }
                ].map((metric, i) => (
                    <div key={i} className="bento-card group p-10 relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-4">{metric.label}</p>
                                <h3 className="text-5xl md:text-6xl font-black tracking-tighter">{metric.val}</h3>
                            </div>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-[15deg] group-hover:scale-110" 
                                 style={{ background: `hsla(${metric.hue}, 0.1)`, color: `hsl(${metric.hue})`, border: `1px solid hsla(${metric.hue}, 0.2)` }}>
                                <metric.icon size={30} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.08] group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                            <div className="w-full h-full min-h-[128px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparkData}>
                                        <Area type="monotone" dataKey="val" stroke={`hsl(${metric.hue})`} strokeWidth={4} fill={`hsl(${metric.hue})`} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* ─── UPCOMING PRIORITY ─── */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="w-2 h-8 bg-primary rounded-full" />
                        <h2 className="text-3xl font-black tracking-tight">Priority Trajectory</h2>
                    </div>

                    {upcomingEvent ? (
                        <div className="bento-card p-12 md:p-16 flex flex-col md:flex-row gap-16 items-center relative overflow-hidden group">
                            <div className="absolute top-[-10%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-[-15deg]">
                                <Calendar size={400} />
                            </div>
                            
                            <div className="w-32 h-32 rounded-[2.5rem] bg-primary text-white flex flex-col items-center justify-center shadow-3xl shadow-primary/40 transform group-hover:rotate-[10deg] transition-all">
                                <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{new Date(upcomingEvent.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-5xl font-black leading-none">{new Date(upcomingEvent.date).getDate()}</span>
                            </div>

                            <div className="flex-1 space-y-8 text-center md:text-left z-10">
                                <div className="space-y-3">
                                   <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-soft text-primary border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em]">
                                      <Activity size={12} className="animate-pulse" /> High Priority Milestone
                                   </div>
                                   <h3 className="text-4xl md:text-6xl font-[900] tracking-tight leading-[0.95]">{upcomingEvent.title}</h3>
                                </div>
                                <p className="text-xl font-medium text-[var(--text-secondary)] leading-relaxed max-w-2xl">{upcomingEvent.description}</p>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                   <div className="flex -space-x-4">
                                      {[1, 2, 3, 4].map(i => (
                                         <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Users size={16} className="text-[var(--text-secondary)]" />
                                         </div>
                                      ))}
                                   </div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] underline decoration-primary underline-offset-8 decoration-2">1,240 Nodes Active</p>
                                </div>
                            </div>
                            <button onClick={() => onRegister(upcomingEvent.id)} 
                                    className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center shadow-3xl shadow-primary/30 hover:scale-[1.15] active:scale-95 transition-all group-hover:translate-x-4">
                                <ArrowRight size={40} />
                            </button>
                        </div>
                    ) : (
                        <div className="bento-card py-32 text-center border-dashed border-2 opacity-50">
                            <Calendar size={60} className="mx-auto mb-6 text-[var(--text-secondary)]" />
                            <p className="text-xs font-black uppercase tracking-[0.5em] text-[var(--text-secondary)]">Subsystem Clear: No Pending Trajectories</p>
                        </div>
                    )}

                    {/* Quick Hub */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Ticket, label: 'Access Control', hue: 'var(--p-h)' },
                            { icon: CheckCircle2, label: 'Entry Sync', hue: 'var(--accent-cyan)' },
                            { icon: Wallet, label: 'Financial Hub', hue: 'var(--accent-purple)' },
                            { icon: Terminal, label: 'Dev Console', hue: 'var(--accent-rose)' }
                        ].map((action, i) => (
                            <button key={i} className="bento-card flex flex-col items-center justify-center gap-6 group hover:translate-y-[-10px] p-10">
                                <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all group-hover:scale-110"
                                     style={{ background: `hsla(${action.hue}, 0.1)`, color: `hsl(${action.hue})` }}>
                                    <action.icon size={26} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── LIVE DATA STREAM ─── */}
                <div className="lg:col-span-4 h-full hidden md:block">
                    <div className="bento-card h-full min-h-[700px] flex flex-col p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] rotate-12"><Activity size={300} /></div>
                        
                        <div className="flex items-center justify-between mb-16 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight">Active Stream</h3>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Node Telemetry Source</p>
                            </div>
                            <Terminal size={24} className="text-primary opacity-50" />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-10 pr-4 relative z-10 custom-scrollbar">
                           {logs.length > 0 ? logs.slice(0, 15).map((log, i) => (
                               <div key={i} className="flex gap-6 group/log">
                                   <div className="flex flex-col items-center pt-2">
                                       <div className={`w-3 h-3 rounded-full transition-all duration-700 ${i === 0 ? 'bg-primary shadow-[0_0_20px_var(--primary)] scale-125' : 'bg-slate-700'}`} />
                                       <div className="w-px h-full bg-[var(--border-color)] my-3 group-last/log:hidden" />
                                   </div>
                                   <div className="pb-4">
                                       <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">{log.user}</p>
                                       <p className="text-xs font-semibold leading-relaxed tracking-tight text-[var(--text-secondary)] group-hover/log:text-[var(--text-main)] transition-colors">{log.action}</p>
                                       <p className="text-[8px] font-black opacity-30 mt-3 uppercase tracking-widest">{log.timestamp}</p>
                                   </div>
                               </div>
                           )) : (
                               <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-6">
                                  <Shield size={60} />
                                  <p className="text-xs font-black uppercase tracking-[0.5em]">Encryption Integrity Stable</p>
                               </div>
                           )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GlobalStudentDashboard;
