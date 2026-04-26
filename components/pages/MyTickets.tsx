
import React, { useState } from 'react';
import { Registration, Event, Club } from '../../types';
import { Ticket, QrCode, Calendar, MapPin, Download, ShieldCheck, Clock, AlertCircle, Filter, Search, ArrowRight } from 'lucide-react';

interface Props {
  registrations: Registration[];
  events: Event[];
  clubs: Club[];
  isDarkMode: boolean;
}

const MyTickets: React.FC<Props> = ({ registrations, events, clubs, isDarkMode }) => {
  const [filter, setFilter] = useState<'active' | 'past'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const handlePrint = (ticketId: string) => {
    setActiveTicketId(ticketId);
    setTimeout(() => {
        window.print();
        setActiveTicketId(null);
    }, 300);
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
                                        onClick={() => handlePrint(reg.ticketId || reg.id)}
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
        </div>
      )}

      {/* Ticket Preview Modal (Visual Pass) */}
      {isPreviewModalOpen && selectedReg && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
              <div className="relative w-full max-w-[1000px] flex flex-col items-center gap-8 max-h-screen overflow-y-auto py-10 no-scrollbar">
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
                  <div className="w-full shadow-[0_0_150px_rgba(37,99,235,0.25)] rounded-[3rem] overflow-hidden bg-white text-black p-12 flex flex-col gap-10 transition-all transform scale-[1.0] md:scale-[1.05] mt-4 select-none">
                      {(() => {
                           const event = events.find(e => e.id === selectedReg.eventId);
                           const club = clubs.find(c => c.id === event?.clubId);
                           const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${selectedReg.ticketId || selectedReg.id}`;
                           
                           return (
                               <>
                                  <div className="flex justify-between items-start">
                                      <div className="space-y-4">
                                          <div className="flex items-center gap-4">
                                              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-black rounded-2xl">
                                                  {club?.name[0]}
                                              </div>
                                              <div>
                                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Organizers</p>
                                                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">{club?.name}</h2>
                                              </div>
                                          </div>
                                          <h1 className="text-7xl font-[1000] tracking-tighter leading-[0.85] uppercase italic mt-6">PASS</h1>
                                      </div>
                                      <div className="p-4 border-4 border-black rounded-[2.5rem] inline-block bg-white shadow-2xl">
                                          <img src={qrUrl} alt="QR" className="w-44 h-44" />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-12 pt-8 border-t-4 border-black border-dashed">
                                      <div className="space-y-2">
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Title</p>
                                          <h3 className="text-4xl font-black tracking-tight">{event?.title}</h3>
                                          <p className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-lg mt-2 inline-block">
                                              {event?.status === 'Approved' ? (selectedReg.status === 'Approved' ? 'Access Verified' : 'Pending Approver') : 'Event Unverified'}
                                          </p>
                                      </div>
                                      <div className="text-right space-y-2">
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Attendee Credentials</p>
                                          <h3 className="text-2xl font-black tracking-tight">{selectedReg.studentName}</h3>
                                          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedReg.studentRoll}</p>
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

                  <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-2xl px-6">
                     <button 
                        onClick={() => handlePrint(selectedReg.ticketId || selectedReg.id)}
                        className="flex-1 px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-3xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4"
                     >
                        <Download size={22} /> Execute Download
                     </button>
                     <button 
                        onClick={() => setIsPreviewModalOpen(false)}
                        className="px-12 py-6 bg-white/5 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                     >
                        Secure Exit
                     </button>
                  </div>
              </div>
          </div>
      )}

      {/* ─── HIDDEN PRINT AREA ─── */}
      {activeTicketId && (
          <div className="fixed inset-0 z-[-1] opacity-0 pointer-events-none" id="ticket-print-root">
              {registrations.filter(r => (r.ticketId || r.id) === activeTicketId).map(reg => {
                  const event = events.find(e => e.id === reg.eventId);
                  const club = clubs.find(c => c.id === event?.clubId);
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${activeTicketId}`;
                  
                  return (
                      <div key={reg.id} className="w-[100vw] h-[100vh] bg-white flex flex-col items-center justify-center p-20 font-sans text-black">
                          <div className="w-full max-w-4xl border-4 border-black p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col gap-12 bg-white">
                              {/* Decorative elements for print */}
                              <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center justify-center">
                                 <p className="text-[10px] font-black uppercase text-white tracking-[1em]">Institutional Access Protocol</p>
                              </div>
                              
                              <div className="flex justify-between items-start mt-8">
                                  <div className="space-y-4">
                                      <div className="flex items-center gap-5">
                                          <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-4xl font-black rounded-3xl">
                                              {club?.name?.[0] || 'A'}
                                          </div>
                                          <div>
                                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Command Center</p>
                                              <h2 className="text-3xl font-black uppercase italic tracking-tighter">{club?.name || 'MITS CLUB'}</h2>
                                          </div>
                                      </div>
                                      <h1 className="text-7xl font-[1000] tracking-tighter leading-[0.8] uppercase italic mt-10">
                                          ENTRY <br/><span className="text-stroke-black text-transparent">PASS</span>
                                      </h1>
                                  </div>
                                  <div className="text-right space-y-4">
                                      <div className="p-4 border-4 border-black rounded-[2.5rem] inline-block bg-white shadow-2xl">
                                          <img src={qrUrl} alt="QR" className="w-52 h-52 object-contain" />
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Registry Serial</p>
                                         <p className="text-sm font-mono font-black border-2 border-black inline-block px-4 py-1 rounded-xl">{activeTicketId}</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-16 pt-12 border-t-4 border-black border-dashed">
                                  <div className="space-y-3">
                                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Mission / Event</p>
                                      <h3 className="text-5xl font-black tracking-tighter leading-tight">{event?.title || 'Untitled Operation'}</h3>
                                      <p className="text-sm font-black uppercase tracking-widest bg-black text-white self-start px-4 py-1.5 rounded-lg mt-4 inline-block">{event?.type || 'STANDARD'} ACCESS • {reg.studentName}</p>
                                  </div>
                                  <div className="grid grid-cols-1 gap-8">
                                      <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center"><Calendar size={24}/></div>
                                          <div>
                                             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Deployment Date</p>
                                             <p className="text-2xl font-black uppercase tracking-tight">{event?.date || 'SCHEDULED'}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center"><MapPin size={24}/></div>
                                          <div>
                                             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Node Venue</p>
                                             <p className="text-2xl font-black uppercase tracking-tight">MITS CAMPUS MAIN</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-8 flex justify-between items-end border-t-4 border-black pt-10">
                                  <div className="space-y-2">
                                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Student Credentials</p>
                                      <div className="flex items-center gap-10">
                                         <div>
                                            <p className="text-xs font-bold opacity-40 uppercase">Identity</p>
                                            <p className="text-xl font-black uppercase">{reg.studentName}</p>
                                         </div>
                                         <div>
                                            <p className="text-xs font-bold opacity-40 uppercase">Enrollment</p>
                                            <p className="text-xl font-black uppercase">{reg.studentRoll}</p>
                                         </div>
                                      </div>
                                  </div>
                                  <div className="text-right max-w-[280px]">
                                      <p className="text-[8px] font-black uppercase tracking-widest opacity-30 leading-relaxed italic border-l-2 border-black pl-4">
                                          This is a non-transferable institutional pass generated by CMMS. Presentation of student ID is required. Tampering with the QR code invalidates admission rights.
                                      </p>
                                  </div>
                              </div>
                          </div>
                          
                          <style>{`
                              @media print {
                                  body * { visibility: hidden !important; }
                                  #ticket-print-root, #ticket-print-root * { visibility: visible !important; }
                                  #ticket-print-root {
                                      position: absolute !important;
                                      left: 0 !important;
                                      top: 0 !important;
                                      width: 100vw !important;
                                      height: 100vh !important;
                                      background: white !important;
                                      margin: 0 !important;
                                      padding: 0 !important;
                                      z-index: 100000 !important;
                                      display: flex !important;
                                      align-items: center !important;
                                      justify-content: center !important;
                                  }
                                  @page { size: landscape; margin: 0; }
                              }
                              .text-stroke-black {
                                  -webkit-text-stroke: 1px black;
                              }
                          `}</style>
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default MyTickets;
