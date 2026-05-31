import React, { useState, useEffect } from 'react';
import { Club, Event, User, ClubRole, Role } from '../../types';
import { 
  Calendar, 
  MapPin, 
  X, 
  Linkedin, 
  Mail, 
  LayoutDashboard, 
  Edit3, 
  Sparkles, 
  Loader2, 
  ArrowDown,
  Ticket,
  UserPlus,
  Terminal,
  Palette,
  HeartHandshake,
  Trophy,
  Zap,
  Globe2,
  Cpu,
  Fingerprint,
  Users,
  ExternalLink,
  Github,
  Hexagon,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { smartLogicService } from '../../logic';

interface Props {
  club: Club;
  events: Event[];
  members: User[];
  currentUser: User;
  isDarkMode: boolean;
  onApply?: (data: { name: string, rollNumber: string, domain: string, whyJoin: string }) => void;
  onToggleRecruitment?: () => void;
  onUpdateWebsiteContent?: (content: any) => void;
  onUpdateClub?: (club: Club) => void;
  onSwitchToDashboard?: () => void;
  onRegister?: (eventId: string, proxyStudent?: { name: string, roll: string, branch: string }) => Promise<any>;
}

const ClubPublicWebsite: React.FC<Props> = ({ 
  club, events, members, currentUser, isDarkMode, onApply, onToggleRecruitment, onUpdateWebsiteContent, onUpdateClub, onSwitchToDashboard, onRegister
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProxyMode, setIsProxyMode] = useState(false);
  const [proxyData, setProxyData] = useState({ name: '', roll: '', branch: '' });

  const isGuest = currentUser.id === 'guest';
  const showAdminControls = !isGuest && (
      currentUser.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT) ||
      currentUser.globalRole === Role.FACULTY || 
      currentUser.globalRole === Role.SUPER_ADMIN
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getThemeConfig = () => {
    switch (club.category) {
      case 'Technical':
        return {
            id: 'tech',
            primary: 'hsl(var(--primary))',
            gradient: 'from-[#0A0A0B] via-[#0F172A] to-[#0A0A0B]',
            accent: 'text-cyan-400',
            bgAccent: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            icon: <Terminal size={24} />
        };
      case 'Cultural':
        return {
            id: 'cult',
            primary: 'hsl(var(--primary))',
            gradient: 'from-[#0F0A0A] via-[#1E0F0F] to-[#0F0A0A]',
            accent: 'text-rose-400',
            bgAccent: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            icon: <Palette size={24} />
        };
      default:
        return {
            id: 'gen',
            primary: 'hsl(var(--primary))',
            gradient: 'from-[#0A0B0F] via-[#0F111A] to-[#0A0B0F]',
            accent: 'text-emerald-400',
            bgAccent: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            icon: <Trophy size={24} />
        };
    }
  };

  const theme = getThemeConfig();

  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [recruitFormData, setRecruitFormData] = useState({
    name: currentUser?.name || '',
    rollNumber: currentUser?.enrollmentNumber || '',
    domain: 'Tech',
    whyJoin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);
  const [trackingCopied, setTrackingCopied] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id !== 'guest') {
      setRecruitFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        rollNumber: currentUser.enrollmentNumber || prev.rollNumber
      }));
    }
  }, [currentUser]);

  const handleRegister = async () => {
    if ((isGuest || !currentUser || currentUser.id === 'guest') && !isProxyMode) {
        // Redirect to login if guest
        onSwitchToDashboard && onSwitchToDashboard();
        return;
    }
    if (selectedEvent && onRegister) {
        if (isProxyMode) {
            if (!proxyData.name || !proxyData.roll) { alert("Details required"); return; }
            const reg = await onRegister(selectedEvent.id, proxyData);
            if (reg) {
              setSubmittedTrackingId(reg.ticketId || reg.id);
            }
            setProxyData({ name: '', roll: '', branch: '' });
            setIsProxyMode(false);
        } else {
            const regBuffer = await onRegister(selectedEvent.id);
            if (regBuffer) {
              setSubmittedTrackingId(regBuffer.ticketId || regBuffer.id);
            }
        }
        setSelectedEvent(null);
    }
  };

  const handleSubmitApplication = async () => {
    if (!recruitFormData.name || !recruitFormData.rollNumber || !recruitFormData.whyJoin) {
      alert("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    if (onApply) {
      const result = await (onApply as any)({ ...recruitFormData, clubId: club.id });
      if (result && result.trackingId) {
        setSubmittedTrackingId(result.trackingId);
        setIsRecruitModalOpen(false);
        setRecruitFormData({ ...recruitFormData, whyJoin: '' });
      } else if (result === true || result?.success) {
        setIsRecruitModalOpen(false);
      } else {
        alert("Submission failed. Please try again.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-[var(--text-main)] font-sans relative overflow-x-hidden`}>
      
      {/* ─ NAVIGATION ─ */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-4 md:px-6 py-3 md:py-4 ${scrolled ? 'bg-black/60 backdrop-blur-3xl border-b border-white/5' : 'bg-transparent'}`}>
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40`}>
                   {club.logoUrl ? <img src={club.logoUrl} className="w-full h-full object-cover rounded-xl md:rounded-2xl" alt="Logo" /> : <Hexagon size={20} />}
                </div>
                <div>
                   <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase italic leading-none">{club.name}</h1>
                   <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] opacity-40">MITS Core Protocol</span>
                </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-10">
                {['Genesis', 'Operations', 'Council', 'Join'].map(item => (
                    <button key={item} 
                            onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-primary transition-all">
                        {item}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
               {showAdminControls && (
                   <button onClick={onSwitchToDashboard} className="p-2.5 md:p-3 bg-white/10 hover:bg-white/10 rounded-xl md:rounded-2xl border border-white/10 transition-all active:scale-95">
                       <LayoutDashboard size={18} className="md:size-[20px]" />
                   </button>
               )}
               <button className="hidden sm:block h-10 md:h-12 px-5 md:px-6 bg-whitetext-black rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                   Pulse Link
               </button>

               {/* Mobile Menu Button */}
               <button 
                  className="lg:hidden p-2.5 bg-white/10 rounded-xl border border-white/10 transition-all active:scale-90"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                  {isMobileMenuOpen ? <X size={20} /> : <div className="w-5 h-5 flex flex-col justify-center gap-1.5"><div className="w-full h-0.5 bg-current rounded-full"/><div className="w-2/3 h-0.5 bg-current rounded-full"/></div>}
               </button>
            </div>
         </div>

         {/* Mobile Menu Overlay */}
         {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-[68px] bg-black/95 backdrop-blur-3xl z-[90] animate-in fade-in slide-in-from-top-10 duration-500 p-8">
                <div className="space-y-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-primary mb-8 opacity-40">Command Sequences</p>
                  {['Genesis', 'Operations', 'Council', 'Join'].map((item, idx) => (
                      <button 
                          key={item}
                          onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
                          className="w-full flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-white/10 hover:bg-primary/10 transition-all animate-slide-up"
                          style={{ animationDelay: `${idx * 100}ms` }}
                      >
                          <span className="text-sm font-black uppercase tracking-[0.2em]">{item}</span>
                          <ArrowDown size={18} className="-rotate-90 opacity-30" />
                      </button>
                  ))}
                  
                  <div className="pt-12 mt-12 border-t border-white/5 space-y-4">
                      <button onClick={onSwitchToDashboard} className="w-full flex items-center justify-center gap-4 py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl">
                          Uplink to Mainframe <LayoutDashboard size={20} />
                      </button>
                  </div>
                </div>
            </div>
         )}
      </nav>


      {/* ─ HERO SECTION ─ */}
      <section id="genesis" className="relative min-h-screen flex items-center justify-center p-8 lg:p-24 overflow-hidden bg-grid">
         <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-90`} />
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px]" />
         
         <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 reveal">
                <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl`}>
                    <div className="flex h-2 w-2 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">Uplink Established</span>
                </div>

                <div className="space-y-6">
                   <h2 className="text-7xl lg:text-9xl font-[1000] tracking-[-0.06em] leading-[0.85] uppercase italic">
                      {club.name} <br/>
                      <span className="text-gradient animate-gradient">Protocol</span>
                   </h2>
                   <p className="text-xl lg:text-2xl font-medium opacity-60 leading-relaxed max-w-xl">
                      {club.tagline || "Redefining student initiatives through architectural precision and creative synergy."}
                   </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                   <button onClick={() => document.getElementById('operations')?.scrollIntoView({behavior: 'smooth'})}
                           className="h-16 px-10 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl shadow-primary/30 flex items-center gap-4 hover:scale-[1.05] transition-all">
                      Explore Missions <ArrowDown size={20} />
                   </button>
                   {showAdminControls && (
                       <button onClick={() => setIsEditMode(!isEditMode)}
                               className="h-16 px-10 bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white/10 transition-all">
                          <Edit3 size={20} /> Studio Mode
                       </button>
                   )}
                </div>
            </div>

            <div className="hidden lg:block relative reveal" style={{ animationDelay: '0.4s' }}>
                <div className="bento-card p-4 aspect-square overflow-hidden group">
                   <img src={club.bannerUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200"} 
                        className="w-full h-full object-cover rounded-[2.5rem] opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                   <div className="absolute top-10 right-10 p-6 bg-black rounded-3xl border border-white/10 animate-float">
                      <Zap size={40} className="text-primary" fill="currentColor" />
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* ─ MISSION PANEL ─ */}
      <section id="genesis" className="py-24 border-y border-white/5 relative bg-white/10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Core Objective</h3>
               <p className="text-3xl font-black tracking-tight leading-tight">{club.description || "Synthesizing theoretical knowledge into tangible community impact through integrated leadership."}</p>
            </div>
            <div className="lg:col-span-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(club.customSections || []).slice(0, 2).map((sec, i) => (
                      <div key={i} className="bento-card p-6 md:p-10 flex flex-col gap-6 group hover:border-primary/50 transition-all">
                         <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            {theme.icon}
                         </div>
                         <h4 className="text-2xl font-black tracking-tight">{sec.title}</h4>
                         <p className="text-sm font-medium opacity-50 leading-relaxed">{sec.content}</p>
                      </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ─ OPERATIONS PIPELINE ─ */}
      <section id="operations" className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6 space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
               <div>
                  <h3 className="text-6xl lg:text-8xl font-black tracking-[-0.05em] uppercase italic">Active <br /> <span className="text-gradient">Operations</span></h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mt-4 ml-2">Node Availability: Synchronized</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {events.length > 0 ? events.slice(0, 6).map((event, i) => (
                   <div key={event.id} className="bento-card flex flex-col overflow-hidden group reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="h-48 relative overflow-hidden">
                         <img src={event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"} 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-1110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#111c44] to-transparent opacity-60" />
                         <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
                            {event.type}
                         </div>
                      </div>
                      <div className="p-6 md:p-10 flex-1 flex flex-col gap-4">
                         <div className="flex items-center gap-3 text-primary">
                            <Calendar size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{event.date}</span>
                         </div>
                         <h4 className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">{event.title}</h4>
                         <p className="text-xs font-medium opacity-50 line-clamp-2 leading-relaxed">{event.description}</p>
                         <button onClick={() => setSelectedEvent(event)}
                                 className="mt-6 h-14 bg-white/10 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all">
                             Deep Link
                         </button>
                      </div>
                   </div>
               )) : (
                   <div className="col-span-full py-20 bg-white/10 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-[1em]">No operations queued</p>
                   </div>
               )}
            </div>
         </div>
      </section>

      {/* ─ COUNCIL ─ */}
      <section id="council" className="py-32 bg-white/10 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 space-y-20">
            <div className="text-center space-y-4">
               <h3 className="text-6xl font-black tracking-tighter uppercase italic">The Council</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Architects of Governance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
               {members.filter(m => m.clubMemberships.some(cm => cm.clubId === club.id && cm.role !== 'Member')).map((leader, i) => (
                   <div key={leader.id} className="group text-center space-y-6 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/10 border border-white/10">
                         <img src={leader.photoUrl || `https://i.pravatar.cc/300?u=${leader.id}`} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 gap-4">
                            <a href="#" className="p-3 bg-whitetext-black rounded-xl hover:scale-110 transition-all"><Linkedin size={18}/></a>
                            <a href="#" className="p-3 bg-whitetext-black rounded-xl hover:scale-110 transition-all"><Mail size={18}/></a>
                         </div>
                      </div>
                      <div>
                         <h5 className="text-lg font-black tracking-tight">{leader.name}</h5>
                         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">{leader.clubMemberships.find(m => m.clubId === club.id)?.role}</p>
                      </div>
                   </div>
               ))}
            </div>
         </div>
      </section>

      {/* ─ RECRUITMENT CALL ─ */}
      <section id="join" className="py-40 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary opacity-5" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
            <h3 className="text-8xl lg:text-[12rem] font-[1000] tracking-[-0.08em] uppercase italic opacity-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">RECRUIT</h3>
            <div className="space-y-6">
                <h4 className="text-5xl lg:text-7xl font-black tracking-tighter italic">Join the <span className="text-gradient">Legacy</span></h4>
                <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium leading-relaxed">We are seeking visionary architects, engineering prodigies, and strategic leaders for the 2026 tenure.</p>
            </div>
            <button 
              onClick={() => setIsRecruitModalOpen(true)}
              className="h-20 px-16 bg-whitetext-black rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-4xl hover:scale-105 active:scale-95 transition-all"
            >
                Initiate Application
            </button>
         </div>
      </section>

      {/* ─ EVENT MODAL ─ */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black overflow-y-auto" onClick={() => setSelectedEvent(null)}>
            <div className="relative w-full max-w-2xl bg-[#050505] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-0 overflow-hidden shadow-4xl my-auto animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <div className="relative h-48 md:h-64">
                    <img src={selectedEvent.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 md:top-6 right-4 md:right-6 p-3 md:p-4 bg-black/50 backdrop-blur-xl rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-colors"><X size={20}/></button>
                </div>

                <div className="p-6 md:p-12 space-y-6 md:space-y-10">
                    <div className="space-y-2 md:space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">{selectedEvent.type} Protocol</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter italic text-white line-clamp-2">{selectedEvent.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div className="p-4 md:p-6 bg-white/10 rounded-2xl md:rounded-3xl border border-white/5 flex items-center gap-4 md:gap-5">
                            <Calendar className="text-primary" size={20} />
                            <div>
                                <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-black opacity-30">Timestamp</p>
                                <p className="text-sm md:text-md font-black">{selectedEvent.date}</p>
                            </div>
                        </div>
                        <div className="p-4 md:p-6 bg-white/10 rounded-2xl md:rounded-3xl border border-white/5 flex items-center gap-4 md:gap-5">
                            <MapPin className="text-primary" size={20} />
                            <div>
                                <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-black opacity-30">Node Location</p>
                                <p className="text-sm md:text-md font-black italic">MITS_CORE</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Briefing</h5>
                        <p className="text-sm md:text-md font-medium opacity-60 leading-relaxed italic">"{selectedEvent.description}"</p>
                    </div>

                    <div className="pt-4 md:pt-6">
                        <button onClick={handleRegister}
                                className="w-full h-16 md:h-18 bg-whitetext-black rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 shadow-3xl">
                            {isGuest ? 'Login to Register' : 'Commit Registration'} <Ticket size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ─ RECRUITMENT FORM MODAL ─ */}
      {isRecruitModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto" onClick={() => setIsRecruitModalOpen(false)}>
          <div className="relative w-full max-w-3xl bg-[#050505] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 space-y-8 md:space-y-12 my-auto animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)]" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsRecruitModalOpen(false)}
              className="absolute top-6 md:top-10 right-6 md:right-10 p-3 md:p-4 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 rounded-xl md:rounded-2xl transition-all border border-white/10"
            >
              <X size={20} />
            </button>

            <div className="space-y-3 md:space-y-4">
              <div className="flex h-1.5 w-24 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-white">
                Recruitment <span className="text-gradient">Request</span>
              </h2>
              <p className="text-sm md:text-lg opacity-40 font-medium tracking-wide uppercase">Core Access Application • Session {new Date().getFullYear()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Identity Tag</label>
                <input 
                  type="text" 
                  value={recruitFormData.name}
                  onChange={(e) => setRecruitFormData({...recruitFormData, name: e.target.value})}
                  placeholder="Legal Name"
                  className="w-full h-16 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm focus:border-primary focus:bg-white/10 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Registry Number</label>
                <input 
                  type="text" 
                  value={recruitFormData.rollNumber}
                  onChange={(e) => setRecruitFormData({...recruitFormData, rollNumber: e.target.value})}
                  placeholder="Enrolment (e.g. 0901CS...)"
                  className="w-full h-16 bg-white/10 border border-white/10 rounded-2xl px-6 font-black text-sm focus:border-primary focus:bg-white/10 outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Preferred Functional Domain</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Tech', 'Management', 'Content', 'Social Media'].map(domain => (
                  <button 
                    key={domain}
                    onClick={() => setRecruitFormData({...recruitFormData, domain})}
                    className={`h-14 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                      recruitFormData.domain === domain 
                      ? 'bg-primary border-primary text-white shadow-lg' 
                      : 'bg-white/10 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Mission Rationale</label>
              <textarea 
                rows={4}
                value={recruitFormData.whyJoin}
                onChange={(e) => setRecruitFormData({...recruitFormData, whyJoin: e.target.value})}
                placeholder="Why do you wish to join the legacy of this protocol?"
                className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 font-medium text-sm focus:border-primary focus:bg-white/10 outline-none transition-all resize-none leading-relaxed italic"
              />
            </div>

            <div className="pt-6">
              <button 
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="w-full h-20 bg-whitetext-black rounded-[2rem] font-black text-xs uppercase tracking-[0.6em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isSubmitting ? (
                  <>Processing... <Loader2 className="animate-spin" size={24} /></>
                ) : (
                  <>Commit Application <UserPlus size={24} /></>
                )}
              </button>
              <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.4em] opacity-20">
                Authorized submission via MITS Institutional protocol
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─ FOOTER ─ */}
      <footer className="py-20 border-t border-white/5 text-center px-6">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
            Institutional Asset • Powered by CLIX HUB v2.8
         </p>
      </footer>

      {/* ─── APPLICATION SUCCESS OVERLAY ─── */}
      {submittedTrackingId && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#050505] border border-emerald-500/20 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] my-auto animate-in zoom-in-95 duration-500">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-8 md:p-10 space-y-6 md:space-y-8 text-center">
              {/* Success icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Execution Successful!</h3>
                <p className="text-slate-500 text-xs md:text-sm">Sequence logged for <strong className="text-white">{club.name}</strong>. Access recorded via institutional tracking ID.</p>
              </div>
              {/* Tracking ID box */}
              <div className="p-4 md:p-5 rounded-2xl bg-white/10 border border-white/10 space-y-3">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">Tracking Reference</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-md md:text-lg font-mono font-black text-white">{submittedTrackingId}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(submittedTrackingId);
                      setTrackingCopied(true);
                      setTimeout(() => setTrackingCopied(false), 2000);
                    }}
                    className={`p-2 rounded-lg transition-all ${trackingCopied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {trackingCopied ? <CheckCircle2 size={14}/> : <Copy size={14}/>}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <button
                  onClick={() => { setSubmittedTrackingId(null); onSwitchToDashboard?.(); }}
                  className="w-full h-14 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  Enter Mainframe Tracker →
                </button>
                <button
                  onClick={() => setSubmittedTrackingId(null)}
                  className="w-full h-12 bg-white/10 border border-white/10 text-slate-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Resume Observation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubPublicWebsite;
