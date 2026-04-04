
import React, { useEffect, useState } from 'react';
import { Event, Club } from '../../types';
import Footer from '../Footer';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe,
  Calendar,
  Users,
  ChevronRight,
  Code,
  Cpu,
  Activity,
  CreditCard,
  Briefcase,
  Target,
  Sun,
  Moon,
  Sparkles,
  BarChart3,
  Award,
  MessageSquare,
  ArrowUpRight,
  Play
} from 'lucide-react';

interface Props {
  events: Event[];
  clubs: Club[];
  onLogin: () => void;
  onRegister: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
}

const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return { count, startCounting: () => setStarted(true) };
};

const LandingPage: React.FC<Props> = ({ events, clubs, onLogin, onRegister, isDarkMode, onToggleTheme, onOpenDeveloper, onOpenProfile, onNavigate }) => {
  const upcomingEvents = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const hiringClubs = clubs.filter(c => c.recruitmentActive);

  const studentsCounter = useCounter(12000);
  const clubsCounter = useCounter(clubs.length || 45);
  const eventsCounter = useCounter(events.length || 120);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { studentsCounter.startCounting(); clubsCounter.startCounting(); eventsCounter.startCounting(); } }); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#0099FF] selection:text-white ${isDarkMode ? 'bg-[#02040a] text-white' : 'bg-[#F4F7FE] text-[#2B3674]'}`}>

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-2xl border-b ${isDarkMode ? 'bg-[#02040a]/70 border-white/[0.06]' : 'bg-white/70 border-slate-200/50'}`}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 transform -rotate-12">
                <Zap size={20} className="fill-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">CLIX<span className="text-cyan-400">HUB</span></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Campus Nexus</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Clubs', action: () => onNavigate && onNavigate('clubs') },
              { label: 'Events', action: () => onNavigate && onNavigate('events') },
              { label: 'Verify', action: () => onNavigate && onNavigate('verify-cert') },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onLogin}
              className="group px-6 py-2.5 bg-[#0099FF] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-[#0099FF]/25 hover:shadow-xl hover:shadow-[#0099FF]/30 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              Launch <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse ${isDarkMode ? 'bg-[#0099FF]/15' : 'bg-blue-200/40'}`} style={{ animationDuration: '4s' }} />
          <div className={`absolute top-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] animate-pulse ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-100/30'}`} style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className={`absolute -bottom-20 left-1/2 w-[800px] h-[400px] rounded-full blur-[120px] ${isDarkMode ? 'bg-blue-900/8' : 'bg-blue-50/30'}`} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md mb-10" style={{ borderColor: isDarkMode ? 'rgba(34,211,238,0.3)' : 'rgba(34,211,238,0.2)', background: isDarkMode ? 'rgba(34,211,238,0.08)' : 'rgba(34,211,238,0.06)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">CLIX HUB — Campus Nexus</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-[-0.04em] leading-[0.88] mb-8">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>Reimagine</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Campus Life.</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            The complete campus nexus platform. {clubs.length || 40}+ clubs. Smart recruitment. Verifiable certificates. Instant ticketing. All powered by intelligent systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegister}
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-cyan-500/30 hover:scale-[1.03] transition-all flex items-center gap-3"
            >
              Join CLIX HUB <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate && onNavigate('platform')}
              className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border flex items-center gap-3 ${isDarkMode ? 'bg-white/[0.03] border-cyan-400/20 text-white hover:bg-white/[0.06]' : 'bg-white border-cyan-200 text-slate-700 hover:bg-cyan-50 shadow-lg'}`}
            >
              <Play size={14} /> Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section id="stats-section" className={`py-6 border-y ${isDarkMode ? 'bg-white/[0.015] border-white/[0.06]' : 'bg-slate-50/50 border-slate-200/50'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {[
            { value: studentsCounter.count.toLocaleString() + '+', label: 'Active Students', icon: Users },
            { value: clubsCounter.count + '+', label: 'Student Clubs', icon: Globe },
            { value: eventsCounter.count + '+', label: 'Events Hosted', icon: Calendar },
            { value: '99.9%', label: 'Uptime', icon: Activity },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-4 py-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0099FF]/10 text-[#0099FF]' : 'bg-blue-50 text-[#0099FF]'}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CLUB MARQUEE ─── */}
      {clubs.length > 0 && (
        <section className={`py-10 overflow-hidden ${isDarkMode ? 'bg-[#02040a]' : 'bg-white'}`}>
          <div className="flex items-center justify-center gap-3 mb-6 opacity-40">
            <Globe size={14} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Powering {clubs.length} Student Communities</p>
          </div>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
              {[...clubs, ...clubs].map((club, i) => (
                <div key={`${club.id}-${i}`} onClick={() => onNavigate && onNavigate('clubs')}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl border cursor-pointer transition-all hover:scale-105 ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06] hover:border-[#0099FF]/30' : 'bg-slate-50 border-slate-100 hover:border-[#0099FF]/50'}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: club.themeColor }}>{club.name[0]}</div>
                  <span className="text-sm font-bold tracking-tight">{club.name}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 items-center">
              {[...clubs, ...clubs].map((club, i) => (
                <div key={`${club.id}-${i}-dup`} onClick={() => onNavigate && onNavigate('clubs')}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl border cursor-pointer transition-all hover:scale-105 ${isDarkMode ? 'bg-white/[0.02] border-white/[0.06] hover:border-[#0099FF]/30' : 'bg-slate-50 border-slate-100 hover:border-[#0099FF]/50'}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: club.themeColor }}>{club.name[0]}</div>
                  <span className="text-sm font-bold tracking-tight">{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RECRUITMENT DRIVES ─── */}
      {hiringClubs.length > 0 && (
        <section className={`py-20 border-y ${isDarkMode ? 'bg-[#0099FF]/5 border-[#0099FF]/10' : 'bg-[#0099FF]/5 border-[#0099FF]/10'}`}>
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center gap-3 mb-12 justify-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0099FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0099FF]"></span>
              </span>
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#0099FF]">Live Recruitment Drives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {hiringClubs.map(club => (
                <div key={club.id} className={`group relative p-7 rounded-3xl border transition-all hover:scale-[1.02] hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/10 hover:border-[#0099FF]/50 hover:shadow-2xl' : 'bg-white border-slate-200 hover:shadow-xl'}`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity">
                    <Target size={80} style={{ color: club.themeColor }} />
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ backgroundColor: club.themeColor }}>{club.name[0]}</div>
                    <div>
                      <h3 className="font-black text-base leading-tight">{club.name}</h3>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{club.category} Wing</p>
                    </div>
                  </div>
                  <button onClick={onLogin}
                    className="w-full py-3 bg-[#0099FF] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#007ACC] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0099FF]/20">
                    <Briefcase size={13} /> Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BENTO FEATURES GRID ─── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-[#0099FF]`}>Platform Capabilities</span>
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mt-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Everything. One Dashboard.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <div onClick={() => onNavigate && onNavigate('clubs')}
              className={`col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl p-10 border relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-[#0099FF]/30 hover:shadow-2xl' : 'bg-white border-slate-200 hover:shadow-xl'}`}>
              <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-all duration-700">
                <Globe size={280} className="text-[#0099FF]" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0099FF] flex items-center justify-center text-white mb-8 shadow-lg shadow-[#0099FF]/20 group-hover:scale-110 transition-transform">
                    <Users size={26} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-4">Centralized Registry</h3>
                  <p className={`font-medium leading-relaxed max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    A single source of truth for {clubs.length || 40}+ student organizations. Access memberships, history, and alumni networks.
                  </p>
                </div>
                <div className="mt-10 flex items-center gap-2 text-[#0099FF] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                  Explore Directory <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

            <div className={`col-span-1 md:col-span-1 lg:col-span-2 rounded-3xl p-8 border relative overflow-hidden group transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-purple-500/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Award size={22} /></div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>MITS-721</span>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Verifiable Credentials</h3>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Blockchain-backed certificates with QR verification for every event.</p>
            </div>

            <div className={`col-span-1 rounded-3xl p-8 border relative overflow-hidden group transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-[#0099FF]/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0099FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#0099FF]/20 text-[#0099FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><CreditCard size={22} /></div>
                <h3 className="text-xl font-black tracking-tight mb-2">Zero-Fee UPI</h3>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Direct student-to-club payments with auto reconciliation.</p>
              </div>
            </div>

            <div onClick={() => onNavigate && onNavigate('live-feed')}
              className={`col-span-1 rounded-3xl p-8 border relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BarChart3 size={22} /></div>
              <h3 className="text-xl font-black tracking-tight mb-2">Live Analytics</h3>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Real-time campus activity tracking and performance dashboards.</p>
            </div>

            <div className={`col-span-1 md:col-span-3 lg:col-span-2 rounded-3xl p-8 border relative overflow-hidden group transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Recruitment AI</h3>
                  <p className={`font-medium max-w-xs text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Automated resume screening and candidate ranking powered by Gemini 2.0.</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Cpu size={26} /></div>
              </div>
              <div className="mt-8 h-2 w-full rounded-full overflow-hidden" style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: '68%' }} />
              </div>
            </div>

            <div className={`col-span-1 md:col-span-1 lg:col-span-2 rounded-3xl p-8 border relative overflow-hidden group transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-rose-500/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform"><MessageSquare size={22} /></div>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-2">Club Channels</h3>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Real-time messaging, polls, and media sharing within club communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE EVENTS ─── */}
      <section className={`py-24 border-y ${isDarkMode ? 'bg-[#050914] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#0099FF] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0099FF]">Live Feed</span>
              </div>
              <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Campus Pulse</h2>
            </div>
            <button onClick={() => onNavigate && onNavigate('events')} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-400 hover:text-[#0099FF]' : 'text-slate-500 hover:text-[#0099FF]'}`}>
              View All Events <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <div key={event.id} className={`group p-8 rounded-3xl border transition-all hover:scale-[1.02] hover:-translate-y-1 ${isDarkMode ? 'bg-[#0d121d] border-white/5 hover:border-[#0099FF]/30 hover:shadow-2xl' : 'bg-white border-slate-200 hover:shadow-xl'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>{event.type}</div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-[#0099FF]">{new Date(event.date).getDate()}</p>
                    <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                  </div>
                </div>
                <h3 className={`text-xl font-black tracking-tight mb-3 line-clamp-2 transition-colors group-hover:text-[#0099FF]`}>{event.title}</h3>
                <p className={`text-sm line-clamp-2 mb-8 font-medium leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{event.description}</p>
                <button onClick={onLogin}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white text-[#02040a] hover:bg-slate-200' : 'bg-[#2B3674] text-white hover:bg-[#0099FF]'}`}>
                  Register Now
                </button>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className={`col-span-full py-28 text-center border-2 border-dashed rounded-3xl ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                <Calendar size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECT SPOTLIGHT ─── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#0099FF]/10 text-[#0099FF] flex items-center justify-center mb-8">
            <Code size={32} />
          </div>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Architected for Scale.</h2>
          <p className={`text-xl font-medium max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Built by <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Naman Lahariya</span> using React, Supabase, and Google Gemini AI. Designed to handle the complexity of a 12,000+ student campus.
          </p>
          <div className="pt-8 flex justify-center gap-4">
            <button onClick={onOpenProfile} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:shadow-lg shadow-md'}`}>
              <Sparkles size={14} /> View Architect Profile
            </button>
          </div>
        </div>
      </section>

      <Footer
        onOpenDeveloper={onOpenDeveloper || (() => { })}
        onOpenProfile={onOpenProfile}
        onNavigate={onNavigate || (() => { })}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default LandingPage;
