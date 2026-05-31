
import React, { useState, useRef } from 'react';
import { Registration, Event, Club } from '../../types';
import { Ticket, QrCode, Calendar, MapPin, Download, ShieldCheck, Clock, AlertCircle, Filter, Search, ArrowRight, Printer } from 'lucide-react';

interface Props {
  registrations: Registration[];
  events: Event[];
  clubs: Club[];
  isDarkMode: boolean;
}

const MyTickets: React.FC<Props> = ({ registrations, events, clubs, isDarkMode }) => {
  const [filter, setFilter] = useState<'active' | 'past'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Download ticket as a printable PDF/image via a dedicated print window
  const handleDownload = (reg: Registration) => {
    setSelectedReg(reg);
    
    // Increased timeout for DOM sync
    setTimeout(() => {
        const printAnchor = document.getElementById('print-ticket-area');
        if (!printAnchor) {
            alert("Digital node synchronizing. Re-engaging...");
            return;
        }

        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(s => s.outerHTML)
            .join('\n');

        const html = `
            <html>
                <head>
                    <title>MITS Institutional Pass - ${reg.ticketId || reg.id}</title>
                    ${styles}
                    <style>
                        body { background: white !important; margin: 0; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
                        @page { size: portrait; margin: 0; }
                    </style>
                </head>
                <body onload="setTimeout(() => { window.print(); window.close(); }, 1200);">
                    <div style="width: 800px; transform: scale(1.0); transform-origin: top center;">
                        ${printAnchor.innerHTML}
                    </div>
                </body>
            </html>
        `;

        const win = window.open('', '_blank', 'width=1000,height=900');
        if (win) { win.document.write(html); win.document.close(); }
    }, 250);
  };

  const handlePrint = (ticketId: string) => {
    const reg = registrations.find(r => (r.ticketId || r.id) === ticketId);
    if (reg) handleDownload(reg);
  };

  const handlePreview = (reg: Registration) => {
    setSelectedReg(reg);
    setIsPreviewModalOpen(true);
  };

  const now = new Date();

  const filteredRegistrations = registrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    if (!event) return false;
    
    const eventDate = new Date(event.date);
    const isPast = eventDate < now && eventDate.toDateString() !== now.toDateString();
    
    // Filter by Tab
    if (filter === 'active' && isPast) return false;
    if (filter === 'past' && !isPast) return false;

    // Filter by Search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return event.title.toLowerCase().includes(term) || 
               (clubs.find(c => c.id === event.clubId)?.name || '').toLowerCase().includes(term) ||
               reg.ticketId?.toLowerCase().includes(term);
    }

    return true;
  }).sort((a, b) => {
      const dateA = new Date(events.find(e => e.id === a.eventId)?.date || '').getTime();
      const dateB = new Date(events.find(e => e.id === b.eventId)?.date || '').getTime();
      return filter === 'active' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>Digital Access Passes</h1>
          <p className="text-slate-500 font-medium text-lg">Secure, verifiable credentials for campus entry.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className={`flex items-center px-4 py-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Search size={18} className="text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search event or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`ml-3 bg-transparent outline-none text-sm font-bold w-full ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
                />
            </div>

            {/* Filter Toggle */}
            <div className={`p-1 rounded-2xl border flex ${isDarkMode ? 'bg-[#111C44] border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <button 
                    onClick={() => setFilter('active')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'active' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-500'}`}
                >
                    Active
                </button>
                <button 
                    onClick={() => setFilter('past')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'past' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-500'}`}
                >
                    History
                </button>
            </div>
        </div>
      </header>

      {/* Tickets Grid */}
      {filteredRegistrations.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-20 border-4 border-dashed rounded-[3rem] text-center space-y-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-slate-700' : 'bg-slate-100 text-slate-300'}`}>
            <Ticket size={48} />
          </div>
          <div>
            <p className={`text-xl font-black uppercase tracking-widest opacity-40 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>
                No {filter} passes found
            </p>
            <p className="text-slate-500 mt-2 font-medium">Register for events to populate your wallet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredRegistrations.map(reg => {
            const event = events.find(e => e.id === reg.eventId);
            const club = clubs.find(c => c.id === event?.clubId);
            const isApproved = reg.status === 'Approved';
            const ticketColor = club?.themeColor || '#4318FF';
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${reg.ticketId || reg.id}`;
            
            return (
              <div key={reg.id} className="relative group perspective-1000 cursor-pointer" onClick={() => handlePreview(reg)}>
                {/* Ticket Container */}
                <div className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-[#111C44] border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
                    
                    {/* Decorative Top Bar */}
                    <div className="h-3 w-full" style={{ background: `linear-gradient(90deg, ${ticketColor}, #a855f7)` }} />

                    <div className="flex flex-col md:flex-row">
                        {/* Left: Main Info */}
                        <div className="flex-1 p-8 md:p-10 relative">
                            {/* Watermark */}
                            <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none transform rotate-12">
                                <ShieldCheck size={180} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg" style={{ backgroundColor: ticketColor }}>
                                                {club?.name[0]}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {club?.name} Presents
                                            </span>
                                        </div>
                                        {isApproved ? (
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <ShieldCheck size={12} /> Verified
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={12} /> Processing
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className={`text-3xl font-black tracking-tighter leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>
                                        {event?.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {event?.type} Access • General Entry
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Date & Time</p>
                                        <div className={`flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>
                                            <Calendar size={16} className="text-primary" /> 
                                            {event?.date}
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Location</p>
                                        <div className={`flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}>
                                            <MapPin size={16} className="text-rose-500" /> 
                                            MITS Campus
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="relative md:w-0 md:border-l-2 border-dashed border-slate-700/20 flex flex-row md:flex-col items-center justify-center py-4 md:py-0">
                            <div className={`absolute left-0 md:left-auto md:top-[-10px] -translate-x-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`} />
                            <div className={`absolute right-0 md:right-auto md:bottom-[-10px] translate-x-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`} />
                        </div>

                        {/* Right: QR Code & ID */}
                        <div className={`w-full md:w-64 p-8 flex flex-col items-center justify-center text-center gap-6 ${isDarkMode ? 'bg-[#0B1437]/50' : 'bg-slate-50'}`}>
                            {isApproved ? (
                                <>
                                    <div className="bg-white p-3 rounded-2xl shadow-xl">
                                        <img src={qrUrl} alt="Ticket QR" className="w-24 h-24 object-contain" />
                                    </div>
                                    <div className="space-y-1 w-full">
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Ticket ID</p>
                                        <p className="text-xs font-mono font-bold text-slate-500 break-all bg-slate-200/50 dark:bg-slate-800/50 p-2 rounded-lg select-all">
                                            {reg.ticketId}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDownload(reg); }}
                                        className="w-full py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download size={14} /> Download Pass
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                                    <Clock size={48} className="text-amber-500 animate-pulse" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-amber-500">Verification Pending</p>
                                        <p className="text-[10px] text-slate-500 max-w-[150px]">Payment is being verified by the treasurer.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            );
        })}
        </div>
      )}

      {/* Ticket Preview Modal (Visual Pass) */}
      {isPreviewModalOpen && selectedReg && (
          <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
              <div className="relative w-full max-w-4xl flex flex-col items-center my-auto animate-in zoom-in-95 duration-500 py-10">
                  <div className="w-full bg-white text-black p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border-4 border-black relative overflow-hidden flex flex-col gap-8 md:gap-12 shadow-4xl">
                     <div className="absolute top-0 left-0 w-full h-8 bg-black flex items-center justify-center">
                        <p className="text-[8px] font-black uppercase text-white tracking-[0.6em]">Core Compliance Node</p>
                     </div>
                  <button 
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="absolute top-4 right-4 md:top-8 md:right-8 p-4 bg-white/10 hover:bg-rose-500/20 hover:text-rose-500 text-white rounded-2xl border border-white/10 transition-all z-[1100]"
                  >
                    <ArrowRight size={24} className="rotate-180" />
                  </button>

                  <div className="text-center space-y-2 mb-2 relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                         <QrCode size={14} /> Pass Validation Sequence
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase italic">Institutional Access Pass</h2>
                      <p className="text-slate-400 font-medium italic opacity-60">"Present this QR at the gate node for authenticated entry."</p>
                  </div>

                  {/* The Actual Pass Design */}
                  <div id="event-pass-print-area" className="w-full shadow-[0_0_150px_rgba(37,99,235,0.25)] rounded-[3rem] overflow-hidden bg-white text-black p-12 flex flex-col gap-10 transition-all transform scale-[1.0] md:scale-[1.05] mt-4 select-none">
                      {(() => {
                           const event = events.find(e => e.id === selectedReg.eventId);
                           const club = clubs.find(c => c.id === event?.clubId);
                           const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${selectedReg.ticketId || selectedReg.id}`;
                           
                           return (
                               <>
                                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mt-4">
                                      <div className="space-y-4 text-center md:text-left">
                                          <div className="flex flex-col md:flex-row items-center gap-4">
                                              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-black rounded-2xl">
                                                  {club?.name[0]}
                                              </div>
                                              <div>
                                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Organizers</p>
                                                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">{club?.name}</h2>
                                              </div>
                                          </div>
                                          <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-[0.85] uppercase italic">PASS</h1>
                                      </div>
                                      <div className="p-4 border-4 border-black rounded-[2.5rem] inline-block bg-white shadow-2xl">
                                          <img src={qrUrl} alt="QR" className="w-32 h-32 md:w-44 md:h-44" />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-6 md:pt-8 border-t-4 border-black border-dashed">
                                      <div className="space-y-2 text-center md:text-left">
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Title</p>
                                          <h3 className="text-2xl md:text-4xl font-black tracking-tight">{event?.title}</h3>
                                          <p className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-lg mt-2 inline-block">
                                              {event?.status === 'Approved' ? (selectedReg.status === 'Approved' ? 'Access Verified' : 'Pending Approver') : 'Event Unverified'}
                                          </p>
                                      </div>
                                      <div className="text-center md:text-right space-y-2">
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Attendee Credentials</p>
                                          <h3 className="text-xl md:text-2xl font-black tracking-tight">{selectedReg.studentName}</h3>
                                          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedReg.studentRoll}</p>
                                      </div>
                                  </div>

                                  <div className="flex justify-between items-end border-t-4 border-black pt-8">
                                      <div>
                                          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">Registry ID</p>
                                          <p className="text-lg font-mono font-black">{selectedReg.ticketId || 'TX-PENDING'}</p>
                                      </div>
                                      <div className="text-right max-w-[250px]">
                                          <p className="text-[8px] font-bold uppercase tracking-widest opacity-30 leading-relaxed italic border-l-2 border-black pl-4">
                                              This institutional credential grants one-time entry to MITS core facilities for the specified mission duration.
                                          </p>
                                      </div>
                                  </div>
                               </>
                           );
                      })()}
                  </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-10 md:mt-12 w-full max-w-2xl px-4 md:px-6">
                     <button 
                        onClick={() => handlePrint(selectedReg.ticketId || selectedReg.id)}
                        className="h-16 md:h-20 flex-1 px-8 md:px-12 bg-primary text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4"
                     >
                        <Download size={20} /> Execute Download
                     </button>
                     <button 
                        onClick={() => setIsPreviewModalOpen(false)}
                        className="h-16 md:h-20 px-8 md:px-12 bg-white/5 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                     >
                        Secure Exit
                     </button>
                  </div>
              </div>
          </div>
          )}
      {/* HIDDEN PERSISTENT PRINT ANCHOR */}
      <div id="print-ticket-area" className="fixed inset-0 z-[-1] opacity-0 pointer-events-none overflow-hidden">
          {selectedReg && (
              <div className="w-[1000px] bg-white text-black p-12 flex flex-col gap-10">
                  {(() => {
                        const event = events.find(e => e.id === selectedReg?.eventId);
                        const club = clubs.find(c => c.id === event?.clubId);
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${selectedReg?.ticketId || selectedReg?.id}`;
                        return (
                            <div className="border-[12px] border-black p-12 rounded-[4rem] relative overflow-hidden bg-white min-h-[600px] flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center justify-center">
                                    <p className="text-[10px] font-black uppercase text-white tracking-[1em]">MITS Institutional Entry Protocol</p>
                                </div>
                                <div className="flex justify-between items-start mt-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-5xl font-black rounded-3xl">
                                                {club?.name?.[0] || 'M'}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Command Node</p>
                                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{club?.name || 'MITS Organization'}</h2>
                                            </div>
                                        </div>
                                        <h1 className="text-8xl font-[1000] tracking-tighter leading-[0.8] uppercase italic mt-12">ENTRY <br/><span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>PASS</span></h1>
                                    </div>
                                    <div className="p-6 border-4 border-black rounded-[2.5rem] bg-white shadow-2xl">
                                        <img src={qrUrl} alt="QR" className="w-56 h-56" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-16 pt-12 mt-12 border-t-4 border-black border-dashed">
                                    <div>
                                        <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Mission Identifier</p>
                                        <h3 className="text-4xl font-black tracking-tighter leading-tight">{event?.title}</h3>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                                        <h3 className="text-3xl font-black tracking-tight">{selectedReg?.studentName}</h3>
                                        <p className="font-mono text-sm font-black opacity-40">{selectedReg?.ticketId || selectedReg?.id}</p>
                                    </div>
                                </div>
                            </div>
                        );
                  })()}
              </div>
          )}
      </div>
    </div>
  );
};

export default MyTickets;
