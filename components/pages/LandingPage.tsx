
import React, { useEffect, useState } from 'react';
import { Event, Club } from '../../types';
import Footer from '../Footer';
import {
  ArrowRight,
  Zap,
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
  Sparkles,
  BarChart3,
  Award,
  MessageSquare,
  ArrowUpRight,
  Play,
  Monitor,
  MousePointer2,
  X,
  ShieldCheck,
  Loader2
} from 'lucide-react';

interface Props {
  events: Event[];
  clubs: Club[];
  onLogin: () => void;
  onRegister: () => void;
  isDarkMode: boolean;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
  onProposeUnit?: (proposal: any) => Promise<{ success: boolean; id: string }>;
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

const LandingPage: React.FC<Props> = ({ events, clubs, onLogin, onRegister, isDarkMode, onOpenDeveloper, onOpenProfile, onNavigate, onProposeUnit }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);
  const [proposalData, setProposalData] = useState({
    type: 'Club' as 'Club' | 'Team',
    title: '',
    category: 'Technical',
    proposerName: '',
    proposerRoll: '',
    proposerEmail: '',
    missionStatement: '',
    estimatedMembers: 10
  });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalData.title || !proposalData.proposerName || !proposalData.missionStatement) {
      alert("Please complete all required identity nodes.");
      return;
    }
    setIsSubmittingProposal(true);
    if (onProposeUnit) {
      const res = await onProposeUnit(proposalData);
      if (res.success) {
        setProposalSuccess(res.id);
        setIsProposalModalOpen(false);
        setProposalData({
          type: 'Club',
          title: '',
          category: 'Technical',
          proposerName: '',
          proposerRoll: '',
          proposerEmail: '',
          missionStatement: '',
          estimatedMembers: 10
        });
      }
    }
    setIsSubmittingProposal(false);
  };

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
    <div className={`min-h-screen font-sans selection:bg-primary selection:text-white bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-700`}>
      
      {/* ─── NEXT-GEN NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass border-b ${isDarkMode ? 'hsla(var(--primary-raw), 0.03)' : 'hsla(var(--primary-raw), 0.01)'}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => onNavigate?.('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-[1rem] md:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 transform group-hover:rotate-[15deg] transition-all duration-500">
                <Zap size={20} className="fill-white md:size-[24px]" />
              </div>
              <div className="absolute inset-0 bg-primary/20 blur-xl scale-75 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none mb-0.5 md:mb-1 uppercase italic">
                CLIX<span className="text-primary">HUB</span>
              </h1>
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-60">Architect Protocol</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { label: 'Clubs', action: () => onNavigate?.('clubs') },
              { label: 'Events', action: () => onNavigate?.('events') },
              { label: 'Analytics', action: () => onNavigate?.('live-feed') },
              { label: 'Verify', action: () => onNavigate?.('verify-cert') },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary hover:bg-primary-soft"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-6 md:px-8 py-3 md:py-3.5 bg-[var(--text-main)] text-[var(--bg-main)] rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-3 active:scale-95"
            >
              <span className="hidden sm:inline">Access Mainframe</span>
              <span className="sm:hidden">Access</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-all active:scale-90"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <ArrowRight className="rotate-180" size={18} /> : <div className="w-5 h-5 flex flex-col justify-center gap-1.5"><div className="w-full h-0.5 bg-current rounded-full"/><div className="w-3/4 h-0.5 bg-current rounded-full self-end"/></div>}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-[var(--bg-main)]/95 backdrop-blur-3xl z-[100] animate-in fade-in slide-in-from-top-10 duration-500 overflow-y-auto">
            <div className="p-8 space-y-4">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mb-8 opacity-60">System Navigation Map</p>
              {[
                { label: 'Club Repository', action: () => onNavigate?.('clubs'), icon: Globe },
                { label: 'Event Operations', action: () => onNavigate?.('events'), icon: Calendar },
                { label: 'Live Data', action: () => onNavigate?.('live-feed'), icon: Activity },
                { label: 'Certificate Verify', action: () => onNavigate?.('verify-cert'), icon: Award },
                { label: 'Platform Status', action: () => onNavigate?.('platform'), icon: Zap },
              ].map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between p-6 rounded-[2rem] border border-[var(--border-color)] bg-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon size={22} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="opacity-30" />
                </button>
              ))}

              <div className="pt-12 mt-12 border-t border-[var(--border-color)]">
                <button
                  onClick={onRegister}
                  className="w-full flex items-center justify-center gap-4 p-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl shadow-primary/20"
                >
                  Terminate Guest Mode & Sync <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>


      {/* ─── ULTRA-HERO SECTION ─── */}
      <section className="relative pt-40 md:pt-52 pb-24 md:pb-40 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary-soft rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-accent-rose rounded-full blur-[180px] opacity-10 animate-pulse animation-delay-2000" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <div className="reveal inline-flex items-center gap-4 px-6 py-3 rounded-full border glass mb-14 animate-float">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Now Enhanced with Smart Automation</span>
          </div>

          <h1 className="reveal text-[4.5rem] md:text-[7rem] lg:text-[9.5rem] font-[900] tracking-[-0.05em] leading-[0.85] mb-12">
            Architecture for <br />
            <span className="text-gradient animate-gradient italic">Infinite</span> Campus.
          </h1>

          <p className="reveal text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-16 font-medium text-[var(--text-secondary)]">
            The institutional-grade platform for campus governance. Discover 40+ clubs, automate logistics, and secure your achievements with verifiable digital credentials.
          </p>

          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onRegister}
              className="btn-premium px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-3xl shadow-primary/40 hover:scale-[1.05] transition-all flex items-center gap-4"
            >
              Get Started Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate?.('platform')}
              className="px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] transition-all border glass hover:bg-primary-soft flex items-center gap-4"
            >
              <MousePointer2 size={18} /> Platform Tour
            </button>
          </div>
        </div>

        {/* Floating Devices/Visuals placeholder */}
        <div className="mt-32 max-w-[1200px] mx-auto relative reveal opacity-40 hover:opacity-100 transition-opacity duration-1000">
           <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </section>

      {/* ─── LIVE SYSTEM FEED ─── */}
      <section id="stats-section" className="py-20 relative px-8 border-y border-[var(--border-color)] overflow-hidden">
         <div className="absolute inset-0 bg-primary-soft/30 opacity-50" />
         <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-around gap-12 relative z-10">
          {[
            { value: studentsCounter.count.toLocaleString() + '+', label: 'Nodes Connected', icon: Users, color: 'hsl(var(--accent-cyan))' },
            { value: clubsCounter.count + '+', label: 'Active Orgs', icon: Globe, color: 'var(--primary)' },
            { value: eventsCounter.count + '+', label: 'Events Processed', icon: Calendar, color: 'hsl(var(--accent-purple))' },
            { value: 'LIVE', label: 'System Health', icon: Activity, color: 'hsl(var(--accent-rose))' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-4 px-6 md:px-10">
              <div className="w-16 h-16 rounded-[1.5rem] glass flex items-center justify-center" style={{ color: stat.color }}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-4xl font-black tracking-tighter mb-1">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </div>
          ))}
         </div>
      </section>

      {/* ─── SYSTEM CORE GRID ─── */}
      <section className="py-24 md:py-40 px-6 md:px-8 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-24 space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-1 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Architecture</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl">
               Engineered for the Modern Campus.
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            
            {/* Feature 1: Clubs */}
            <div onClick={() => onNavigate?.('clubs')}
              className="bento-card md:col-span-6 lg:col-span-7 flex flex-col justify-between group cursor-pointer aspect-video md:aspect-auto min-h-[450px]">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Monitor size={30} />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tight mb-6">Centralized Workspace</h3>
                <p className="text-xl font-medium text-[var(--text-secondary)] leading-relaxed max-w-lg mb-10">
                  A high-velocity directory for all 40+ MITS organizaciones. Track growth, manage rosters, and explore student ecosystems in real-time.
                </p>
                <div className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-[10px]">
                   Access Registry <ArrowUpRight size={16} />
                </div>
              </div>
            </div>

            {/* Feature 2: Blockchain Certs */}
            <div className="bento-card md:col-span-3 lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-[#0d121d] to-black text-white hover:border-accent-rose/30">
               <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-accent-rose/10 text-[#FF4D8D] flex items-center justify-center shadow-lg"><Award size={28} /></div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">MITS-256V</div>
               </div>
               <div>
                 <h3 className="text-3xl font-black tracking-tight mb-4 text-white">Verifiable Assets</h3>
                 <p className="text-lg font-medium opacity-60">
                   Cryptographic signatures for every achievement. Built-in instant verification for employers and institutions.
                 </p>
               </div>
            </div>

            {/* Feature 3: AI Recruitment */}
            <div className="bento-card md:col-span-3 lg:col-span-5 relative overflow-hidden group">
               <div className="absolute top-[-5%] right-[-5%] opacity-5 group-hover:opacity-15 transition-opacity duration-700">
                  <Cpu size={300} />
               </div>
               <div className="relative z-10 space-y-6">
                 <h3 className="text-3xl font-black tracking-tight">Rapid Screening</h3>
                 <p className="text-lg font-medium text-[var(--text-secondary)]">Automated interview scheduling and applicant tracking with Institutional Logic integration.</p>
                 <div className="pt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 animate-pulse w-[75%]" />
                 </div>
               </div>
            </div>

            {/* Feature 4: Payments */}
            <div className="bento-card md:col-span-6 lg:col-span-7 flex flex-col justify-between hover:border-accent-cyan/30">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-accent-cyan/10 text-[#00E5FF] flex items-center justify-center border border-accent-cyan/20">
                    <CreditCard size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black tracking-tight">Rapid Payments</h3>
                    <p className="text-lg font-medium text-[var(--text-secondary)]">Zero-friction UPI integration for event ticketing.</p>
                 </div>
               </div>
               <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl glass border-slate-100 dark:border-white/5 space-y-2">
                     <p className="text-[8px] font-black uppercase tracking-widest text-primary">Transaction Speed</p>
                     <p className="text-2xl font-black">&lt; 2s</p>
                  </div>
                  <div className="p-4 rounded-2xl glass border-slate-100 dark:border-white/5 space-y-2">
                     <p className="text-[8px] font-black uppercase tracking-widest text-[#00E5FF]">Processing Fee</p>
                     <p className="text-2xl font-black">0.0%</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LIVE EVENT HUB ─── */}
      <section className={`py-24 md:py-40 border-y glass ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Activity size={16} className="text-primary animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Operations</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight">Events Infrastructure.</h2>
             </div>
             <button onClick={() => onNavigate?.('events')} className="px-8 py-4 rounded-2xl glass border-[var(--border-color)] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                Explore All Events
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bento-card group flex flex-col justify-between min-h-[400px]">
                <div>
                   <div className="flex justify-between items-center mb-10">
                      <span className="px-4 py-2 rounded-xl bg-primary-soft text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">{event.type}</span>
                      <div className="flex flex-col items-end">
                         <span className="text-4xl font-black text-primary leading-none">{new Date(event.date).getDate()}</span>
                         <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                   <p className="text-[var(--text-secondary)] font-medium line-clamp-3 leading-relaxed">{event.description}</p>
                </div>
                <button onClick={onLogin} className="w-full mt-10 py-5 bg-[var(--text-main)] text-[var(--bg-main)] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all">
                   Secure Pass
                </button>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-full py-32 text-center glass border-2 border-dashed rounded-[3rem]">
                <Calendar size={60} className="mx-auto mb-6 text-[var(--text-secondary)] opacity-30" />
                <p className="text-xs font-black uppercase tracking-[0.5em] text-[var(--text-secondary)]">Subsystem Quiet: No Upcoming Sequences</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── UNIT GENESIS SECTION ─── */}
      <section className="py-24 md:py-40 px-6 md:px-8 relative overflow-hidden bg-white/10 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
           <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Channel</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-white">Propose <br/><span className="text-gradient">Genesis.</span></h2>
              <p className="text-xl font-medium text-slate-500 max-w-xl leading-relaxed">
                 Do you have a vision for a new technical node or a temporary operation team? Submit a formal proposal directly to the Dean Student Welfare and architect the next phase of MITS culture.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <button 
                  onClick={() => setIsProposalModalOpen(true)}
                  className="h-20 px-10 bg-primary text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] shadow-4xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                 >
                    Initiate Unit Protocol <ArrowUpRight size={20} />
                 </button>
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-14 h-14 rounded-2xl border-4 border-[#050505] overflow-hidden bg-white/10">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="avatar" />
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-2xl border-4 border-[#050505] bg-white/10 flex items-center justify-center text-primary font-black text-xs">+12</div>
                 </div>
              </div>
           </div>
           
           <div className="relative mt-8 lg:mt-0">
              <div className="bento-card p-6 md:p-10 space-y-8 bg-white/10 border-white/10">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary">Live Intake Statistics</p>
                       <h4 className="text-3xl font-black tracking-tight text-white italic uppercase">Protocol Pipeline</h4>
                    </div>
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl animate-pulse">
                       <Activity size={24} />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="p-6 bg-white/10 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-primary/40 transition-all">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]">Processing Time</p>
                          <p className="text-xl font-black text-white italic tracking-widest leading-none">48 HOURS</p>
                       </div>
                       <ChevronRight size={20} className="text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div className="p-6 bg-white/10 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-primary/40 transition-all">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Global Vacancy</p>
                          <p className="text-xl font-black text-white italic tracking-widest leading-none">04 UNITS</p>
                       </div>
                       <ChevronRight size={20} className="text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ─── PROPOSAL FORM MODAL ─── */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto" onClick={() => setIsProposalModalOpen(false)}>
           <div className="relative w-full max-w-3xl bg-[#050505] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 space-y-8 md:space-y-12 my-auto animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(59,130,246,0.1)]" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setIsProposalModalOpen(false)}
                className="absolute top-6 md:top-10 right-6 md:right-10 p-3 md:p-4 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 rounded-xl md:rounded-2xl transition-all border border-white/10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Sparkles size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Proposal Initialization Sequence</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">Create <span className="text-gradient">Unit.</span></h2>
              </div>

              <form onSubmit={handleProposalSubmit} className="space-y-8 md:space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Protocol Type</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                           type="button"
                           onClick={() => setProposalData({...proposalData, type: 'Club'})}
                           className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${proposalData.type === 'Club' ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/10 text-white/40 hover:bg-white/10'}`}
                          >Permanent Club</button>
                          <button 
                           type="button"
                           onClick={() => setProposalData({...proposalData, type: 'Team'})}
                           className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${proposalData.type === 'Team' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/10 border-white/10 text-white/40 hover:bg-white/10'}`}
                          >Temporary Team</button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Unit Title</label>
                       <input 
                        required
                        value={proposalData.title}
                        onChange={e => setProposalData({...proposalData, title: e.target.value})}
                        placeholder="e.g. Quantum Computing Node"
                        className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm text-white focus:border-primary outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Proposer Core Identity</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <input 
                        required
                        value={proposalData.proposerName}
                        onChange={e => setProposalData({...proposalData, proposerName: e.target.value})}
                        placeholder="Full Legal Name"
                        className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm text-white focus:border-primary outline-none transition-all"
                       />
                       <input 
                        required
                        value={proposalData.proposerRoll}
                        onChange={e => setProposalData({...proposalData, proposerRoll: e.target.value})}
                        placeholder="Roll (0901CSXX...)"
                        className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm text-white focus:border-primary outline-none transition-all uppercase"
                       />
                       <input 
                        required
                        type="email"
                        value={proposalData.proposerEmail}
                        onChange={e => setProposalData({...proposalData, proposerEmail: e.target.value})}
                        placeholder="Institute Email"
                        className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm text-white focus:border-primary outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Mission Rationale</label>
                    <textarea 
                     required
                     rows={4}
                     value={proposalData.missionStatement}
                     onChange={e => setProposalData({...proposalData, missionStatement: e.target.value})}
                     placeholder="Outline the core objective, planned activities, and institutional benefit..."
                     className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 font-medium text-sm text-white focus:border-primary outline-none transition-all resize-none leading-relaxed italic"
                    />
                 </div>

                 <div className="pt-4">
                    <button 
                     type="submit"
                     disabled={isSubmittingProposal}
                     className="w-full h-20 bg-whitetext-black rounded-[2rem] font-black text-xs uppercase tracking-[0.6em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                    >
                       {isSubmittingProposal ? <>Establishing Uplink... <Loader2 className="animate-spin" size={24}/></> : <>Commit Proposal to Dean <ShieldCheck size={24}/></>}
                    </button>
                    <p className="text-center mt-6 text-[8px] font-black uppercase tracking-[0.5em] opacity-30 italic">Proprietary Submission Node: CLIX_HUB_INSTITUTIONAL</p>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* ─── PROPOSAL SUCCESS OVERLAY ─── */}
      {proposalSuccess && (
        <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="relative w-full max-w-md bg-[#050505] border border-primary/20 rounded-[3rem] overflow-hidden shadow-4xl text-center">
              <div className="h-1.5 w-full bg-primary" />
              <div className="p-12 space-y-8">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary animate-bounce">
                    <ShieldCheck size={40} />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Proposal Logged.</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Your unit proposal has been successfully transmitted to the Dean Student Welfare dashboard. Sequence reference: <strong className="text-white text-xs font-mono">{proposalSuccess}</strong></p>
                 </div>
                 <button onClick={() => setProposalSuccess(null)} className="w-full h-16 bg-whitetext-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Acknowledge Transmission
                 </button>
              </div>
           </div>
        </div>
      )}

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
