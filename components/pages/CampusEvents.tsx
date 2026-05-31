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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Upcoming' | 'Past' | 'My Events'>('Upcoming');

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
    <div className={`min-h-screen p-5 md:p-8 lg:p-12 space-y-10 md:space-y-16 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8f9fa] text-slate-900'} overflow-x-hidden`}>
      
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
               <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`} size={20} />
               <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-black tracking-widest text-[10px] uppercase transition-all ${isDarkMode ? 'bg-white/ text-white placeholder-white/30 border border-white/10 focus:border-primary/50' : 'bg-whitetext-slate-900 placeholder-slate-400 border border-slate-200 focus:border-primary shadow-sm'}`} />
            </div>
            <div className="flex gap-4">
               {['Upcoming', 'Past', 'My Events'].map(t => (
                  <button key={t} onClick={() => setFilter(t as any)}
                     className={`px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${filter === t ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' : (isDarkMode ? 'bg-white/ text-white/50 hover:bg-white/' : 'bg-whitetext-slate-500 hover:bg-slate-50shadow-sm border border-slate-200')}`}>
                     {t}
                  </button>
               ))}
            </div>
            <button className="h-18 w-18 bento-card flex items-center justify-center hover:bg-white/ transition-all group">
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
                         <div className={`lg:col-span-7 p-6 md:p-10 flex flex-col justify-between gap-6 ${isDarkMode ? 'bg-white/' : 'bg-white/'}`}>
                            <div className="space-y-4">
                               <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Organized by {clubs.find(c => c.id === e.clubId)?.name}</span>
                                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/ text-white/50' : 'bg-slate-100 text-slate-500'}`}>{e.type}</span>
                               </div>
                               <h3 className="text-4xl lg:text-5xl font-[1000] tracking-tighter uppercase italic leading-none">{e.title}</h3>
                               <p className={`text-sm font-medium ${isDarkMode ? 'text-white/50' : 'text-slate-500'} leading-relaxed max-w-xl`}>{e.description}</p>
                            </div>
                            <div className={`flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                               <div className="flex items-center gap-3"><Calendar size={16} className="text-primary" /> {new Date(e.date).toLocaleDateString()}</div>
                               <button onClick={() => setSelectedEvent(e)}
                                    className="h-14 w-full bg-whitetext-black rounded-xl font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl hover:translate-y-[-4px] transition-all">
                               Instant Uplink
                            </button>
                            </div>
                         </div>
                      </div>
                   </div>
               ))}
            </div>
         ) : (
            <div className="bento-card py-20 bg-white/ border-2 border-dashed border-white/5 text-center opacity-30">
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
                  <div key={e.id} className={`bento-card p-6 md:p-10 flex flex-col gap-6 md:gap-8 group transition-all reveal ${isDarkMode ? 'bg-[#050505] border border-white/10' : 'bg-whiteborder border-slate-200'}`}>
                     <div className="flex justify-between items-start">
                        <div className={`h-16 w-16 border rounded-2xl flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/ border-white/10' : 'bg-slate-50border-slate-200'}`}>
                           <span className="text-xl font-black text-primary leading-none">{date.getDate()}</span>
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{date.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <button onClick={() => handleToggleSave(e.id)} className={`p-3 bg-white/ rounded-xl transition-all ${savedEventIds.includes(e.id) ? 'text-rose-500' : 'text-white/20 hover:text-rose-400'}`}>
                           <Heart size={16} fill={savedEventIds.includes(e.id) ? "currentColor" : "none"} />
                        </button>
                     </div>

                     <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                           <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/ text-white/50' : 'bg-slate-100 text-slate-500'}`}>{e.type}</span>
                           {isRegistered && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Registered</span>}
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none cursor-pointer" onClick={() => setSelectedEvent(e)}>{e.title}</h4>
                        <p className={`text-xs font-medium line-clamp-2 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{e.description}</p>
                     </div>
                     <div className={`pt-6 border-t flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <button onClick={() => setShareQrEvent(e)} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-40 hover:opacity-100"><QrCode size={14}/> Share</button>
                        <button onClick={() => setSelectedEvent(e)} className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isRegistered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary text-white'}`}>Details</button>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>

      {/* ─ MODAL ─ */}
      {selectedEvent && (
         <div className="fixed inset-0 z-[1000] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
            <div className={`relative w-full md:w-[600px] h-full shadow-4xl flex flex-col animate-in slide-in-from-right duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-l border-white/10' : 'bg-whiteborder-l border-slate-200'}`}>
               <div className="relative h-64 shrink-0">
                  <img src={selectedEvent.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800"} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-xl rounded-2xl text-white hover:bg-rose-500"><X size={20}/></button>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/ text-primary' : 'bg-blue-50 text-blue-600'}`}>{selectedEvent.type}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>ID: {selectedEvent.id.split('-')[0]}</span>
                     </div>
                     <h2 className={`text-4xl font-[1000] tracking-tighter uppercase italic leading-none ${!isDarkMode && 'text-slate-900'}`}>{selectedEvent.title}</h2>
                     <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{selectedEvent.description}</p>
                  </div>

                  {/* Proxy Panel */}
                  {(user.globalRole !== 'Student' || user.clubMemberships.some(m => m.clubId === selectedEvent.clubId)) && (
                      <div className={`p-6 border border-dashed rounded-3xl space-y-4 ${isDarkMode ? 'bg-white/ border-white/20' : 'bg-slate-50border-slate-300'}`}>
                         <div className="flex justify-between items-center">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Identity Proxy</h6>
                            <input type="checkbox" checked={isProxyMode} onChange={() => setIsProxyMode(!isProxyMode)} className="h-6 w-12 rounded-full bg-white/ appearance-none checked:bg-emerald-500 relative cursor-pointer" />
                         </div>
                         {isProxyMode && (
                             <div className="grid grid-cols-1 gap-4">
                                <input placeholder="Student Name" value={proxyData.name} onChange={e => setProxyData({...proxyData, name: e.target.value})} className="h-12 bg-black border border-white/10 rounded-xl px-4 font-bold outline-none" />
                                <input placeholder="Roll Number" value={proxyData.roll} onChange={e => setProxyData({...proxyData, roll: e.target.value})} className="h-12 bg-black border border-white/10 rounded-xl px-4 font-bold outline-none" />
                             </div>
                         )}
                      </div>
                  )}
               </div>
               
               {/* Action Bar */}
               <div className={`p-8 border-t flex gap-4 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-whiteborder-slate-200'}`}>
                  <button onClick={handleRegistrationClick} className="flex-1 h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">
                     {userRegistrations.some(r => r.eventId === selectedEvent.id) ? 'Already Committed' : 'Confirm Registration'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* SUCCESS TICKET PASS MODAL */}
      {successTicket && (
          <div className={`fixed inset-0 z-[2000] backdrop-blur-3xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto ${isDarkMode ? 'bg-[#050505]/98' : 'bg-slate-900/'}`}>
              <div className="w-full max-w-4xl flex flex-col items-center">
                    <button onClick={() => setSuccessTicket(null)} className="absolute top-10 right-10 p-4 bg-white/ border border-white/10 rounded-2xl text-white hover:bg-rose-500"><X size={24} /></button>
                    <div className={`w-full max-w-2xl rounded-[3.5rem] p-12 flex flex-col gap-10 shadow-[0_0_100px_rgba(37,99,235,0.2)] ${isDarkMode ? 'bg-[#111] text-white' : 'bg-whitetext-black'}`}>
                        <div className="flex justify-between items-start">
                            <h3 className="text-6xl font-[1000] tracking-tighter leading-[0.85] uppercase italic">PASS</h3>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${successTicket?.ticketId}`} className="w-40 h-40" alt="Pass QR" />
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
                    </div>
              </div>
          </div>
      )}

      {/* ─────── SHARE QR MODAL ─────── */}
      {shareQrEvent && (() => {
        const shareUrl = `${window.location.origin}?join=${shareQrEvent.id}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}&color=000000&bgcolor=ffffff`;
        const club = clubs.find(c => c.id === shareQrEvent.clubId);
        return (
          <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto" onClick={() => setShareQrEvent(null)}>
            <div className={`relative w-full max-w-md border rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] my-auto animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#050505] border-white/10' : 'bg-whiteborder-slate-200'}`} onClick={e => e.stopPropagation()}>
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${club?.themeColor || '#4318FF'}, #a855f7)` }} />
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Shareable Access Link</p>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white leading-tight">{shareQrEvent.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{club?.name} • {shareQrEvent.date}</p>
                  </div>
                  <button onClick={() => setShareQrEvent(null)} className="p-3 bg-white/ rounded-2xl text-white hover:bg-rose-500 transition-all"><X size={18}/></button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-whiterounded-[2rem] shadow-2xl">
                    <img src={qrUrl} alt="Event QR" className="w-56 h-56" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Scan QR to Register Directly</p>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/ border border-white/10 rounded-xl">
                      <p className="text-[9px] font-mono text-slate-400 truncate flex-1">{shareUrl}</p>
                      <button
                        onClick={() => handleCopyLink(shareUrl)}
                        className={`p-2 rounded-lg transition-all ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-white/ text-slate-400 hover:text-white'}`}
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
                    className={`h-14 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${copiedLink ? 'bg-emerald-500 text-white' : 'bg-white/ border border-white/10 text-white hover:bg-white/'}`}
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
