import React, { useMemo, useState, useEffect } from 'react';
import { Event, Club, Registration, User } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  Sparkles, 
  Filter, 
  Search, 
  Zap, 
  Clock, 
  Heart, 
  X, 
  Share2, 
  UserPlus, 
  CheckCircle2, 
  CreditCard, 
  Loader2,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Hexagon,
  Download,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../db';

interface Props {
  events: Event[];
  clubs: Club[];
  registrations: Registration[];
  onRegister: (eventId: string, proxyStudent?: { name: string, roll: string, branch: string }) => Promise<Registration | undefined>;
  isDarkMode: boolean;
  user: User;
}

const CampusEvents: React.FC<Props> = ({ events, clubs, registrations, onRegister, isDarkMode, user }) => {
  const userRegistrations = registrations.filter(r => r.studentId === user.id);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [shareQrEvent, setShareQrEvent] = useState<Event | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProxyMode, setIsProxyMode] = useState(false);
  const [proxyData, setProxyData] = useState({ name: '', roll: '', branch: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState<Registration | null>(null);
  const [activePrintId, setActivePrintId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchSaved = async () => {
        const saved = await db.getSavedEvents(user.id);
        setSavedEventIds(saved.map(s => s.eventId));
    };
    fetchSaved();
  }, [user.id]);

  useEffect(() => {
    const joinEventId = searchParams.get('join');
    if (joinEventId && events.length > 0) {
      const eventToJoin = events.find(e => e.id === joinEventId);
      if (eventToJoin) {
        setSelectedEvent(eventToJoin);
        // Clear the param after opening to avoid re-opening
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('join');
        setSearchParams(newParams);
      }
    }
  }, [searchParams, events, setSearchParams]);

  const handleToggleSave = async (eventId: string) => {
    await db.toggleSavedEvent(user.id, eventId);
    setSavedEventIds(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  const handleRegistrationClick = async () => {
    if (selectedEvent) {
      if (isProxyMode) {
        if (!proxyData.name || !proxyData.roll || !proxyData.branch) { alert("Complete all proxy details."); return; }
        const reg = await onRegister(selectedEvent.id, proxyData);
        if (reg) setSuccessTicket(reg);
        setProxyData({ name: '', roll: '', branch: '' });
        setIsProxyMode(false);
        setSelectedEvent(null);
      } else {
        const club = clubs.find(c => c.id === selectedEvent.clubId);
        if (selectedEvent.type === 'Paid' && club?.paymentGatewayConfig?.isActive && club.paymentGatewayConfig.provider !== 'ManualUPI') {
            setIsProcessingPayment(true);
            await new Promise(r => setTimeout(r, 1500));
            setIsProcessingPayment(false);
            setPaymentSuccess(true);
            setTimeout(async () => { 
                const reg = await onRegister(selectedEvent.id); 
                if (reg) setSuccessTicket(reg);
                setPaymentSuccess(false); 
                setSelectedEvent(null); 
            }, 1000);
        } else {
            const reg = await onRegister(selectedEvent.id);
            if (reg) setSuccessTicket(reg);
            setSelectedEvent(null);
        }
      }
    }
  };

  const handlePrint = (ticketId: string) => {
    // 1. Target the persistent hidden anchor
    const printAnchor = document.getElementById('print-ticket-area');
    if (!printAnchor || !printAnchor.innerHTML.trim()) {
        alert("Digital credential buffer synchronizing. Please try again.");
        return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(s => s.outerHTML)
        .join('\n');

    const html = `
        <html>
            <head>
                <title>MITS Institutional Pass - ${ticketId}</title>
                ${styles}
                <style>
                    body { background: white !important; margin: 0; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
                    @page { size: landscape; margin: 0; }
                </style>
            </head>
            <body onload="setTimeout(() => { window.print(); window.close(); }, 1200);">
                <div style="width: 1000px; transform: scale(1.0);">
                    ${printAnchor.innerHTML}
                </div>
            </body>
        </html>
    `;

    const win = window.open('', '_blank', 'width=1100,height=850');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const liveEvents = useMemo(() => events.filter(e => new Date(e.date).toDateString() === new Date().toDateString()), [events]);
  const upcomingEvents = useMemo(() => events.filter(e => new Date(e.date) > new Date() && new Date(e.date).toDateString() !== new Date().toDateString()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events]);

  return (
    <div className="min-h-screen p-5 md:p-8 lg:p-12 space-y-10 md:space-y-16 bg-[#050505] text-[var(--text-main)] overflow-x-hidden">
      
      {/* ─ HEADER ─ */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 reveal">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
               <TrendingUp size={14} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Pulse</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-[-0.05em] uppercase italic leading-none">Event <br/><span className="text-gradient">Pipeline</span></h1>
            <p className="text-sm font-medium opacity-50 max-w-sm">Synchronized schedule of upcoming marathons, technical workshops, and cultural galas.</p>
         </div>

         <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:min-w-[400px]">
               <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
               <input placeholder="Search Active Transmissions..." className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 font-black text-sm outline-none focus:border-primary/50 transition-all" />
            </div>
            <button className="h-18 w-18 bento-card flex items-center justify-center hover:bg-white/10 transition-all group">
               <Filter size={24} className="group-hover:scale-110 transition-transform" />
            </button>
         </div>
      </header>

      {/* ─ LIVE NOW ─ */}
      <section className="space-y-10 reveal" style={{ animationDelay: '0.1s' }}>
         <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Live Matrix</h2>
         </div>

         {liveEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {liveEvents.map(e => (
                   <div key={e.id} className="bento-card p-1 p-0 overflow-hidden group hover:border-primary/40 transition-all duration-700">
                      <div className="h-full grid grid-cols-1 lg:grid-cols-12">
                         <div className="lg:col-span-5 relative overflow-hidden">
                            <img src={e.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"} 
                                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 lg:from-transparent to-transparent" />
                            <div className="absolute top-6 left-6 px-4 py-2 bg-primary text-white text-[10px] font-[1000] uppercase tracking-widest rounded-xl shadow-2xl shadow-primary/40">Active Node</div>
                         </div>
                         <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between gap-6 bg-white/2">
                            <div className="space-y-4">
                               <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Organized by {clubs.find(c => c.id === e.clubId)?.name}</span>
                                  <button onClick={() => handleToggleSave(e.id)} className={`transition-all ${savedEventIds.includes(e.id) ? 'text-rose-500 scale-125' : 'text-white/20 hover:text-rose-400'}`}>
                                     <Heart size={20} fill={savedEventIds.includes(e.id) ? "currentColor" : "none"} />
                                  </button>
                               </div>
                               <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-tight group-hover:text-primary transition-colors">{e.title}</h3>
                               <div className="flex items-center gap-6 opacity-40">
                                  <div className="flex items-center gap-2"><MapPin size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">SAC Aud.</span></div>
                                  <div className="flex items-center gap-2"><Users size={14}/> <span className="text-[10px] font-black uppercase tracking-widest">480 Joined</span></div>
                               </div>
                            </div>
                            <button onClick={() => setSelectedEvent(e)}
                                    className="h-14 w-full bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl hover:translate-y-[-4px] transition-all">
                               Instant Uplink
                            </button>
                         </div>
                      </div>
                   </div>
               ))}
            </div>
         ) : (
            <div className="bento-card py-20 bg-white/2 border-2 border-dashed border-white/5 text-center opacity-30">
               <p className="text-[10px] font-black uppercase tracking-[1em]">Frequency Silent • No signals today</p>
            </div>
         )}
      </section>

      {/* ─ FUTURE PIPELINE ─ */}
      <section className="space-y-10 reveal" style={{ animationDelay: '0.2s' }}>
         <div className="flex items-center gap-4">
            <Hexagon size={16} className="text-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Future Sequence</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingEvents.map(e => {
               const date = new Date(e.date);
               const isRegistered = userRegistrations.some(r => r.eventId === e.id);
               return (
                  <div key={e.id} className="bento-card p-6 md:p-10 flex flex-col gap-6 md:gap-8 group hover:border-white/20 transition-all reveal">
                     <div className="flex justify-between items-start">
                        <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                           <span className="text-xl font-black text-primary leading-none">{date.getDate()}</span>
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{date.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div className="flex gap-2">
                           <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${e.type === 'Paid' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'}`}>
                              {e.type}
                           </div>
                           <button onClick={() => handleToggleSave(e.id)} className={`p-3 bg-white/5 rounded-xl transition-all ${savedEventIds.includes(e.id) ? 'text-rose-500' : 'text-white/20 hover:text-rose-400'}`}>
                              <Heart size={16} fill={savedEventIds.includes(e.id) ? "currentColor" : "none"} />
                           </button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h4 className="text-2xl font-black tracking-tight uppercase italic leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedEvent(e)}>{e.title}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">Target: {clubs.find(c => c.id === e.clubId)?.name}</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                           <div className="flex items-center gap-3">
                              <button
                                onClick={(ev) => { ev.stopPropagation(); setShareQrEvent(e); }}
                                className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex items-center gap-2"
                                title="Share Event QR"
                              >
                                <QrCode size={14}/> Share
                              </button>
                           </div>
                           <button onClick={() => setSelectedEvent(e)}
                                   className={`h-12 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isRegistered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105'}`}>
                              {isRegistered ? 'Node Committed' : 'Commit Registration'}
                           </button>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>

      {/* ─ MODAL ─ */}
      {selectedEvent && (
         <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-[#050505] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-4xl my-auto animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                
                {/* Visual Header */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                    <img src={selectedEvent.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 md:top-6 right-4 md:right-6 p-3 md:p-4 bg-black/50 backdrop-blur-xl rounded-xl md:rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={20}/></button>
                    <button onClick={() => { setShareQrEvent(selectedEvent); }} className="absolute top-4 md:top-6 right-16 md:right-24 p-3 md:p-4 bg-black/50 backdrop-blur-xl rounded-xl md:rounded-2xl text-white hover:bg-primary/70 transition-all" title="Share Registration QR"><QrCode size={18}/></button>
                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 space-y-1 md:space-y-2 pr-4">
                       <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border ${selectedEvent.type === 'Paid' ? 'border-amber-500/40 text-amber-500 bg-amber-500/20' : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/20'}`}>
                          {selectedEvent.type} Protocol
                       </span>
                       <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white line-clamp-2">{selectedEvent.title}</h3>
                    </div>
                </div>

                <div className="p-6 md:p-12 space-y-6 md:space-y-10 bg-[#050505]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-5">
                           <div className="p-2 md:p-3 bg-primary/10 text-primary rounded-xl md:rounded-2xl"><Calendar size={20}/></div>
                           <div>
                              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Timestamp</p>
                              <p className="text-md md:text-lg font-black italic">{selectedEvent.date}</p>
                           </div>
                        </div>
                        <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-5">
                           <div className="p-2 md:p-3 bg-amber-500/10 text-amber-500 rounded-xl md:rounded-2xl"><MapPin size={20}/></div>
                           <div>
                              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Venue Node</p>
                              <p className="text-md md:text-lg font-black italic truncate">MITS_CORE_CAMPUS</p>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 flex items-center gap-2"><Fingerprint size={14}/> Mission Briefing</h5>
                       <p className="text-md font-medium opacity-60 leading-relaxed italic">"{selectedEvent.description}"</p>
                    </div>

                    {/* Proxy Panel */}
                    {(user.globalRole !== 'Student' || user.clubMemberships.some(m => m.clubId === selectedEvent.clubId)) && (
                        <div className="p-6 md:p-8 bg-white/2 border border-dashed border-white/20 rounded-3xl space-y-4 md:space-y-6">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <UserPlus size={20} className="text-emerald-400" />
                                 <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Identity Proxy Registration</h6>
                              </div>
                              <input type="checkbox" checked={isProxyMode} onChange={() => setIsProxyMode(!isProxyMode)} className="h-6 w-12 rounded-full bg-white/10 appearance-none checked:bg-emerald-500 relative cursor-pointer transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all checked:after:left-7" />
                           </div>
                           {isProxyMode && (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                                  <input placeholder="Student Alias" value={proxyData.name} onChange={e => setProxyData({...proxyData, name: e.target.value})} className="h-14 bg-black border border-white/10 rounded-xl px-4 font-bold outline-none focus:border-emerald-500" />
                                  <input placeholder="Sequence ID (Roll)" value={proxyData.roll} onChange={e => setProxyData({...proxyData, roll: e.target.value})} className="h-14 bg-black border border-white/10 rounded-xl px-4 font-bold outline-none focus:border-emerald-500" />
                                  <input placeholder="Division (Branch)" value={proxyData.branch} onChange={e => setProxyData({...proxyData, branch: e.target.value})} className="col-span-full h-14 bg-black border border-white/10 rounded-xl px-4 font-bold outline-none focus:border-emerald-500" />
                               </div>
                           )}
                        </div>
                    )}

                    <div className="pt-6 relative">
                       {isProcessingPayment && (
                           <div className="absolute inset-x-0 -top-20 flex flex-col items-center gap-4 text-primary animate-pulse">
                              <Loader2 size={32} className="animate-spin" />
                              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establishing Gateway Uplink...</span>
                           </div>
                       )}
                       {paymentSuccess && (
                           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-4 text-emerald-400">
                              <CheckCircle2 size={64} className="animate-in zoom-in" />
                              <span className="text-xl font-black uppercase tracking-widest italic">Node Verified</span>
                           </div>
                       )}
                       <button onClick={handleRegistrationClick}
                               disabled={isProcessingPayment}
                               className={`w-full h-20 rounded-3xl font-black text-[12px] uppercase tracking-[0.5em] shadow-4xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 ${isProxyMode ? 'bg-emerald-600 text-white' : 'bg-white text-black'}`}>
                           {isProxyMode ? 'Register Proxy Student' : selectedEvent.type === 'Paid' ? `Commit ₹${selectedEvent.fee} Enrollment` : 'Commit Free Enrollment'}
                           <Ticket size={24} />
                       </button>
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* SUCCESS TICKET PASS MODAL */}
      {successTicket && (
          <div className="fixed inset-0 z-[2000] bg-[#050505]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto no-scrollbar">
              <div className="w-full max-w-4xl animate-in zoom-in-95 duration-500 relative py-20 flex flex-col items-center">
                    <button 
                        onClick={() => setSuccessTicket(null)}
                        className="absolute top-0 right-0 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-rose-500 transition-all z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center space-y-6 mb-12">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                           <CheckCircle2 size={24} className="animate-bounce" />
                           <span className="text-xs font-black uppercase tracking-[0.4em]">Node Successfully Committed</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase italic leading-none">Your Entry <span className="text-gradient">Protocol</span></h2>
                        <p className="text-slate-500 font-medium italic opacity-60">"Mission details indexed. Digital pass generated."</p>
                    </div>

                    {/* The Actual Pass Visual */}
                    <div className="w-full max-w-2xl bg-white rounded-[3.5rem] p-12 text-black flex flex-col gap-10 shadow-[0_0_100px_rgba(37,99,235,0.2)]">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-black rounded-2xl">
                                      {clubs.find(c => c.id === events.find(e => e.id === successTicket?.eventId)?.clubId)?.name?.[0] || 'A'}
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Authorized Entry</p>
                                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Institutional Hub</h2>
                                   </div>
                                </div>
                                <h3 className="text-6xl font-[1000] tracking-tighter leading-[0.85] uppercase italic mt-6">PASS</h3>
                            </div>
                            <div className="p-4 border-2 border-black rounded-3xl bg-white">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${successTicket?.ticketId || successTicket?.id}`} className="w-40 h-40" alt="Pass QR" />
                            </div>
                        </div>

                        <div className="pt-8 border-t-2 border-black border-dashed grid grid-cols-2 gap-8">
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Mission Subject</p>
                               <p className="text-2xl font-black">{events.find(e => e.id === successTicket?.eventId)?.title}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                               <p className="text-2xl font-black">{successTicket.studentName}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t-2 border-black pt-8">
                            <div>
                               <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em] mb-1">Pass ID</p>
                               <p className="text-sm font-mono font-black">{successTicket.ticketId || 'Pending_Approval'}</p>
                            </div>
                            <button 
                                onClick={() => handlePrint(successTicket?.ticketId || successTicket?.id)}
                                className="px-10 py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Download size={18} /> Execute Download
                            </button>
                        </div>
                    </div>

                    <p className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-center max-w-md italic leading-relaxed opacity-40">
                        Institutional pass remains valid only with physical student identity verification at the node intake.
                    </p>
                    
                    {/* HIDDEN PERSISTENT PRINT ANCHOR */}
                    <div id="print-ticket-area" className="fixed inset-0 z-[-1] opacity-0 pointer-events-none overflow-hidden">
                        {successTicket && (
                            <div className="w-[1000px] bg-white text-black p-12 flex flex-col gap-10">
                                <div className="border-[12px] border-black p-12 rounded-[4rem] relative overflow-hidden bg-white min-h-[600px] flex flex-col justify-between">
                                    <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center justify-center">
                                        <p className="text-[10px] font-black uppercase text-white tracking-[1em]">MITS Institutional Entry Protocol</p>
                                    </div>
                                    <div className="flex justify-between items-start mt-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-5xl font-black rounded-3xl">
                                                    {clubs.find(c => c.id === events.find(e => e.id === successTicket?.eventId)?.clubId)?.name?.[0] || 'M'}
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Command Node</p>
                                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">{clubs.find(c => c.id === events.find(e => e.id === successTicket?.eventId)?.clubId)?.name || 'MITS Organization'}</h2>
                                                </div>
                                            </div>
                                            <h1 className="text-8xl font-[1000] tracking-tighter leading-[0.8] uppercase italic mt-12">ENTRY <br/><span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>PASS</span></h1>
                                        </div>
                                        <div className="p-6 border-4 border-black rounded-[2.5rem] bg-white shadow-2xl">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${successTicket?.ticketId || successTicket?.id}`} alt="QR" className="w-56 h-56" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-16 pt-12 mt-12 border-t-4 border-black border-dashed">
                                        <div>
                                            <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Mission Identifier</p>
                                            <h3 className="text-4xl font-black tracking-tighter leading-tight">{events.find(e => e.id === successTicket?.eventId)?.title}</h3>
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                                            <h3 className="text-3xl font-black tracking-tight">{successTicket.studentName}</h3>
                                            <p className="font-mono text-sm font-black opacity-40">{successTicket?.ticketId || successTicket?.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
              </div>

              <style>{`
                  @media print {
                      body * { visibility: hidden !important; }
                      #print-ticket-area, #print-ticket-area * { visibility: visible !important; }
                      #print-ticket-area { position: absolute !important; left: 0 !important; top: 0 !important; opacity: 1 !important; }
                      @page { size: landscape; margin: 0; }
                  }
              `}</style>
          </div>
      )}
      {/* ─────── SHARE QR MODAL ─────── */}
      {shareQrEvent && (() => {
        const shareUrl = `${window.location.origin}?join=${shareQrEvent.id}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}&color=000000&bgcolor=ffffff`;
        const club = clubs.find(c => c.id === shareQrEvent.clubId);
        return (
          <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto" onClick={() => setShareQrEvent(null)}>
            <div className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] my-auto animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              {/* Top accent bar */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${club?.themeColor || '#4318FF'}, #a855f7)` }} />
              
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Shareable Access Link</p>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white leading-tight">{shareQrEvent.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{club?.name} • {shareQrEvent.date}</p>
                  </div>
                  <button onClick={() => setShareQrEvent(null)} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={18}/></button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white rounded-[2rem] shadow-2xl">
                    <img src={qrUrl} alt="Event QR" className="w-56 h-56" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Scan QR to Register Directly</p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[9px] font-mono text-slate-400 truncate flex-1">{shareUrl}</p>
                      <button
                        onClick={() => handleCopyLink(shareUrl)}
                        className={`p-2 rounded-lg transition-all ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                      >
                        {copiedLink ? <Check size={14}/> : <Copy size={14}/>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Share options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleCopyLink(shareUrl)}
                    className={`h-14 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                  >
                    {copiedLink ? <><Check size={16}/> Copied!</> : <><Copy size={16}/> Copy Link</>}
                  </button>
                  <button
                    onClick={() => {
                      const win = window.open('', '_blank');
                      if (win) {
                        win.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#000"><img src="${qrUrl}" style="width:400px;height:400px"/></body></html>`);
                        win.print();
                      }
                    }}
                    className="h-14 rounded-2xl bg-primary text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    <QrCode size={16}/> Print QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CampusEvents;
