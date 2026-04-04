
import React, { useState, useRef } from 'react';
import { Event, Registration } from '../../types';
import { 
  Plus, Calendar, Tag, CreditCard, Clock, ShieldCheck, Send, Image as ImageIcon, Upload, 
  Users, ChevronLeft, Search, Ticket, UserPlus, Download, Printer, CheckCircle2, AlertCircle, X,
  MapPin, QrCode, Trash2, Hexagon, Sparkles, Fingerprint, Layers, Activity
} from 'lucide-react';

interface Props {
  events: Event[];
  registrations: Registration[];
  onCreateEvent: (event: Event) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  onRegister: (eventId: string, proxyStudent?: { name: string, roll: string, branch: string }) => void;
  onUpdateRegistration: (reg: Registration) => void;
  isDarkMode: boolean;
  isDirectApprovalEnabled?: boolean;
  clubId: string;
}

const EventOperations: React.FC<Props> = ({ 
  events, 
  registrations, 
  onCreateEvent, 
  onDeleteEvent,
  onRegister, 
  onUpdateRegistration,
  isDarkMode, 
  isDirectApprovalEnabled = false,
  clubId
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<Registration | null>(null);
  const [participantSearch, setParticipantSearch] = useState('');
  
  // Create Event State
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '', description: '', type: 'Free', fee: 0, date: '', status: 'Pending', bannerUrl: ''
  });
  
  // Add Participant State
  const [newParticipant, setNewParticipant] = useState({ name: '', roll: '', branch: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: `evt-${Date.now()}`,
      clubId: clubId, 
      title: newEvent.title!,
      description: newEvent.description!,
      type: newEvent.type as 'Free' | 'Paid',
      fee: newEvent.type === 'Paid' ? Number(newEvent.fee) : 0,
      status: isDirectApprovalEnabled ? 'Approved' : 'Pending',
      date: newEvent.date!,
      bannerUrl: newEvent.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000',
      isFinalized: false
    };
    await onCreateEvent(event);
    setIsModalOpen(false);
    setNewEvent({ title: '', description: '', type: 'Free', fee: 0, date: '', status: 'Pending', bannerUrl: '' });
  };

  const handleDelete = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (onDeleteEvent && window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      await onDeleteEvent(eventId);
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent(prev => ({ ...prev, bannerUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      onRegister(selectedEvent.id, newParticipant);
      setIsAddParticipantOpen(false);
      setNewParticipant({ name: '', roll: '', branch: '' });
      alert("Participant Added Successfully");
    }
  };

  const handleGenerateTicket = (reg: Registration) => {
    if (selectedEvent) {
      const idPart = selectedEvent.id.includes('-') ? selectedEvent.id.split('-')[1] : selectedEvent.id.slice(0, 4);
      const ticketId = `TKT-${idPart.toUpperCase()}-${Date.now().toString().slice(-6)}`;
      onUpdateRegistration({ ...reg, ticketId, status: 'Approved' });
    }
  };

  const handleMassGenerate = () => {
    if (!selectedEvent) return;
    const eventRegs = registrations.filter(r => r.eventId === selectedEvent.id && !r.ticketId && r.status === 'Approved');
    
    if (eventRegs.length === 0) {
      alert("No approved registrations found without tickets. Manually approve participants first or use individual generate.");
      return;
    }

    if (window.confirm(`Generate tickets for ${eventRegs.length} participants?`)) {
      eventRegs.forEach(reg => {
        const idPart = selectedEvent.id.includes('-') ? selectedEvent.id.split('-')[1] : selectedEvent.id.slice(0, 4);
        const ticketId = `TKT-${idPart.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        onUpdateRegistration({ ...reg, ticketId });
      });
      alert("Batch generation complete.");
    }
  };

  const openTicketView = (reg: Registration) => {
    setTicketData(reg);
    setIsTicketModalOpen(true);
  };

  // --- Render ---

  if (selectedEvent) {
    // === EVENT DETAIL VIEW ===
    const eventRegs = registrations.filter(r => r.eventId === selectedEvent.id);
    const approvedCount = eventRegs.filter(r => r.status === 'Approved').length;
    const ticketedCount = eventRegs.filter(r => r.ticketId).length;

    const filteredRegs = eventRegs.filter(r => 
      r.studentName.toLowerCase().includes(participantSearch.toLowerCase()) || 
      r.studentRoll.toLowerCase().includes(participantSearch.toLowerCase())
    );

    return (
      <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-10 md:space-y-14 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Detail Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="w-14 h-14 rounded-2xl glass-elevated border flex items-center justify-center text-slate-400 hover:text-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                   <Hexagon size={18} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Operational Node</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-display leading-[0.9] text-white">
                 {selectedEvent.title}
                 <span className={`ml-4 px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border align-middle ${selectedEvent.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                   {selectedEvent.status}
                 </span>
               </h1>
               <p className="text-slate-500 font-bold text-sm flex items-center gap-3">
                 <Calendar size={16} /> {selectedEvent.date} <span className="w-1 h-1 rounded-full bg-slate-700" /> {selectedEvent.type} {selectedEvent.type === 'Paid' && <span className="text-blue-500">₹{selectedEvent.fee}</span>}
               </p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <button 
                onClick={handleMassGenerate}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
             >
                <Ticket size={18} /> Batch Sequence
             </button>
             <button 
                onClick={() => setIsAddParticipantOpen(true)}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
             >
                <UserPlus size={18} /> Add Personnel
             </button>
          </div>
        </div>

        {/* Tactical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
           {[
             { label: 'Total Registrations', val: eventRegs.length, icon: Users, color: 'blue' },
             { label: 'Verified Clearance', val: approvedCount, icon: ShieldCheck, color: 'emerald' },
             { label: 'Issued Passes', val: ticketedCount, icon: Ticket, color: 'indigo' }
           ].map((metric, i) => (
             <div key={i} className="glass-elevated p-8 rounded-[3rem] border transition-all duration-700 hover:scale-[1.02] flex flex-col justify-between h-52 group shadow-xl">
               <div className="flex justify-between items-start">
                   <div className={`w-14 h-14 rounded-2xl bg-${metric.color}-500/10 text-${metric.color}-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-12`}>
                       <metric.icon size={24} />
                   </div>
                   <Activity size={16} className="text-slate-500 opacity-20 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="space-y-1">
                   <p className="text-4xl font-black font-display text-white tracking-tighter">{metric.val}</p>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{metric.label}</p>
               </div>
             </div>
           ))}
        </div>

        {/* Control Center Table */}
        <div className="glass-elevated rounded-[4rem] border overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-1 text-center lg:text-left">
                <h3 className="text-xl font-black tracking-tighter font-display text-white">Personnel Tracking Ledger</h3>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Real-time Registration Stream</p>
              </div>
              <div className="relative w-full lg:w-96">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                    type="text" 
                    placeholder="Locate Entry by Name/ID..." 
                    value={participantSearch}
                    onChange={e => setParticipantSearch(e.target.value)}
                    className="w-full pl-14 pr-8 py-4 rounded-3xl bg-white/5 border border-white/5 outline-none font-bold text-sm text-white focus:border-blue-500/50 transition-all placeholder-slate-600" 
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 border-b border-white/5">
                       <th className="px-10 py-8">Personnel Identity</th>
                       <th className="px-10 py-8 text-center">Clearance Status</th>
                       <th className="px-10 py-8">Assigned Key</th>
                       <th className="px-10 py-8 text-right">Maneuvers</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 font-sans">
                    {filteredRegs.map(reg => (
                       <tr key={reg.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-10 py-6">
                             <p className="font-black text-white text-base tracking-tight">{reg.studentName}</p>
                             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{reg.studentRoll}</p>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                reg.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                reg.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                             }`}>
                                {reg.status === 'Pending' ? 'In Review' : reg.status}
                             </span>
                          </td>
                          <td className="px-10 py-6">
                             {reg.ticketId ? (
                               <span className="font-mono text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase tracking-widest">{reg.ticketId}</span>
                             ) : (
                               <span className="text-[10px] font-black text-slate-700 line-through tracking-[0.2em]">UNASSIGNED</span>
                             )}
                          </td>
                          <td className="px-10 py-6 text-right">
                             {reg.ticketId ? (
                                <button onClick={() => openTicketView(reg)} className="ml-auto flex items-center gap-3 px-5 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl group/btn">
                                   <Ticket size={16} className="group-hover/btn:rotate-12 transition-transform" /> Inspect Pass
                                </button>
                             ) : (
                                <button 
                                   onClick={() => handleGenerateTicket(reg)}
                                   className={`ml-auto flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl group/btn ${
                                     reg.status === 'Approved' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                   }`}
                                >
                                   {reg.status === 'Approved' ? <><Plus size={16} /> Deploy Pass</> : <><ShieldCheck size={16}/> Authorize</>}
                                </button>
                             )}
                          </td>
                       </tr>
                    ))}
                    {filteredRegs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-10 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                             <Layers size={48} className="text-slate-500" />
                             <p className="font-black uppercase tracking-[0.3em] text-xs text-slate-500">Log Empty • Monitoring System</p>
                          </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Personnel Insertion Overlay */}
        {isAddParticipantOpen && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => setIsAddParticipantOpen(false)} />
              <div className="relative max-w-xl w-full p-12 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-8 animate-in zoom-in-95 duration-500 glass-elevated">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                           <UserPlus size={18} />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Tactical Registry</span>
                       </div>
                       <h3 className="text-3xl font-black tracking-tighter font-display text-white">MANUAL ENTRY</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inserting unauthorized personnel record into ledger.</p>
                    </div>
                    <button onClick={() => setIsAddParticipantOpen(false)} className="p-4 rounded-3xl bg-white/5 text-slate-500 hover:text-white hover:bg-rose-500 transition-all group">
                       <X size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>
                 </div>
                 <form onSubmit={handleAddParticipant} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6">FULL NAME</label>
                       <input required placeholder="E.g. ALAN TURING" value={newParticipant.name} onChange={e => setNewParticipant({...newParticipant, name: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 outline-none font-bold text-white placeholder-slate-700 focus:border-blue-500/50 transition-all shadow-inner" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6">ENROLLMENT ID</label>
                          <input required placeholder="0187CS..." value={newParticipant.roll} onChange={e => setNewParticipant({...newParticipant, roll: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 outline-none font-bold text-white placeholder-slate-700 focus:border-blue-500/50 transition-all shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6">DIVISION</label>
                          <input required placeholder="COMPUTING" value={newParticipant.branch} onChange={e => setNewParticipant({...newParticipant, branch: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 outline-none font-bold text-white placeholder-slate-700 focus:border-blue-500/50 transition-all shadow-inner" />
                       </div>
                    </div>
                    <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                       Register Candidate Entity
                    </button>
                 </form>
              </div>
           </div>
        )}

        {/* Tactical Pass Overlay */}
        {isTicketModalOpen && ticketData && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500" onClick={() => setIsTicketModalOpen(false)}>
              <div className="absolute inset-0 bg-[#02040a]/95 backdrop-blur-3xl" />
              <div className="relative max-w-md w-full animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
                 {/* Print Area Container */}
                 <div id="print-ticket-area" className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative glass-elevated border border-white/10 group">
                    <div className="p-12 relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#0B1437] to-[#010205]">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-1000" />
                       <div className="text-center space-y-10 relative z-10">
                          <div className="flex justify-center">
                             <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                <div className="w-full h-full rounded-[2.2rem] bg-[#0B1437] flex items-center justify-center text-white font-black text-4xl font-display">
                                   {selectedEvent.title[0]}
                                </div>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <h2 className="text-3xl font-black tracking-tighter leading-none text-white font-display uppercase">{selectedEvent.title}</h2>
                             <div className="flex items-center justify-center gap-3">
                                <Activity size={14} className="text-blue-500" />
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Official Entry Pass</p>
                             </div>
                          </div>
                          
                          <div className="relative group/qr p-2">
                             <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                             <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative z-10 scale-95 group-hover:scale-100 transition-transform duration-700">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketData.ticketId || ticketData.id}`} alt="Tactical QR Code" className="w-40 h-40 object-contain grayscale hover:grayscale-0 transition-all" />
                             </div>
                          </div>

                          <div className="space-y-1">
                             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Hold Identity Signature</p>
                             <p className="text-2xl font-black font-display text-white italic tracking-tighter uppercase">{ticketData.studentName}</p>
                             <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">{ticketData.studentRoll}</p>
                          </div>

                          <div className="pt-10 border-t border-dashed border-white/10 flex flex-col items-center gap-2">
                             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">Clearance Node ID</p>
                             <p className="font-mono text-[10px] font-black text-blue-500 bg-blue-500/10 px-6 py-2 rounded-xl border border-blue-500/20 uppercase tracking-[0.2em]">{ticketData.ticketId}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="mt-8 flex gap-6">
                    <button onClick={() => window.print()} className="flex-[2] py-5 bg-white text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-white/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                       <Printer size={18} /> Print Dossier
                    </button>
                    <button onClick={() => setIsTicketModalOpen(false)} className="flex-1 py-5 glass-elevated border border-white/10 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:border-rose-500 transition-all active:scale-95 shadow-xl">
                       CLOSE
                    </button>
                 </div>
              </div>
           </div>
        )}

      </div>
    );
  }

  // === EVENT LIST VIEW (Default) ===
  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-12 md:space-y-16 relative z-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
         <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
               <Calendar size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Event Matrix</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-display leading-[0.9] text-white">
            Mission <span className="text-blue-600">Control</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm max-w-lg leading-relaxed">
            Architecting institutional engagements. Select a tactical node to manage logistics, clearance, and deployment.
          </p>
         </div>
         <button 
          onClick={() => setIsModalOpen(true)} 
          className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 ${isDirectApprovalEnabled ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}
         >
          <Plus size={20} /> {isDirectApprovalEnabled ? 'Authorize Instant Ops' : 'Initiate New Proposal'}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        {events.map(event => (
            <div 
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="group p-8 rounded-[3.5rem] flex flex-col cursor-pointer glass-elevated border shadow-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden"
            >
                {/* Tactical Indicator */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] group-hover:bg-blue-500/10 transition-colors" />

                {isDirectApprovalEnabled && onDeleteEvent && (
                  <button 
                    onClick={(e) => handleDelete(e, event.id)}
                    className="absolute top-6 left-6 z-20 p-4 rounded-2xl bg-white/5 text-slate-500 opacity-60 hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                    title="Terminate Op"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="h-44 w-full rounded-[2.5rem] bg-[#02040a] mb-8 overflow-hidden relative shadow-inner p-1">
                    <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                        <img src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000'} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] to-transparent opacity-60" />
                    </div>
                    <div className="absolute top-6 right-8">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg ${
                            event.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30 backdrop-blur-md' : 'bg-amber-500/20 text-amber-500 border-amber-500/30 backdrop-blur-md'
                        }`}>
                            {event.status === 'Approved' ? <ShieldCheck size={12}/> : <Clock size={12}/>}
                            {event.status}
                        </span>
                    </div>
                </div>
                
                <h3 className="text-2xl font-black tracking-tight font-display mb-3 leading-tight text-white group-hover:text-blue-400 transition-colors uppercase">{event.title}</h3>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
                    <Calendar size={14} className="text-blue-500" /> {event.date}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5 mt-auto">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-tighter text-slate-600">Classification</p>
                        <div className="flex items-center gap-2 text-xs font-black text-white">
                           <Tag size={12} className="text-blue-500" /> {event.type}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-tighter text-slate-600">Operatives</p>
                        <div className="flex items-center gap-2 text-xs font-black text-white">
                           <Users size={12} className="text-blue-500" /> {registrations.filter(r => r.eventId === event.id).length} Registered
                        </div>
                    </div>
                </div>
                
                <div className="mt-8">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] group-hover:ml-2 transition-all flex items-center gap-2">
                    Engage Module <ChevronLeft size={12} className="rotate-180" />
                  </span>
                </div>
            </div>
        ))}
        {events.length === 0 && (
            <div className="col-span-full py-40 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6 glass-elevated border border-dashed border-white/10 opacity-30 grayscale hover:grayscale-0 transition-all">
                <div className="w-20 h-20 rounded-3xl bg-slate-500/10 flex items-center justify-center text-slate-500 border border-white/10">
                   <Calendar size={32} />
                </div>
                <div className="space-y-1">
                   <p className="text-xl font-black font-display text-white uppercase tracking-tighter">Ops Pipeline Void</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Standing by for tactical deployment.</p>
                </div>
            </div>
        )}
      </div>

      {/* Operation Initialization Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
            <div className="relative max-w-2xl w-full p-12 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-10 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[92vh] glass-elevated custom-scrollbar">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                         <Sparkles size={18} />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">{isDirectApprovalEnabled ? 'Strategic Authorization' : 'Mission Proposal'}</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter font-display text-white">
                      INITIALIZE OPERATION
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm">
                      {isDirectApprovalEnabled 
                        ? 'Presidential authority active: This operation will be published immediately across the institutional network.'
                        : 'Institutional protocol mandatory: Sent to High Command for tactical verification and clearance.'}
                    </p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 rounded-3xl bg-white/5 text-slate-500 hover:text-white hover:bg-rose-500 transition-all group">
                     <X size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleCreateSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 ml-8 italic">Operation Nomenclature</label>
                        <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 outline-none font-black text-white placeholder-slate-800 focus:border-blue-500/50 transition-all shadow-inner text-lg tracking-tight" placeholder="E.G. TITAN PROTOCOL" />
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 ml-8 italic">Strategic Narrative</label>
                        <textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 outline-none font-medium h-40 text-white placeholder-slate-800 focus:border-blue-500/50 transition-all shadow-inner leading-relaxed" placeholder="Detailed objective agenda and tactical requirements..." />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-8">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic flex items-center gap-3">
                               <ImageIcon size={14} className="text-blue-500" /> Operational Visual Support
                            </label>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-blue-500 hover:text-white hover:bg-blue-600 px-4 py-1.5 rounded-full border border-blue-500/30 transition-all flex items-center gap-2 uppercase tracking-widest">
                                <Upload size={12} /> Local Injection
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                        <input type="text" value={newEvent.bannerUrl} onChange={e => setNewEvent({...newEvent, bannerUrl: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 outline-none font-mono text-[10px] text-blue-400 placeholder-slate-800 focus:border-blue-500/50 transition-all shadow-inner uppercase tracking-widest" placeholder="HTTPS://SECURE-STORAGE.NODE/IMG.JPG" />
                        {newEvent.bannerUrl && (
                            <div className="h-40 w-full rounded-[2.5rem] overflow-hidden border border-white/5 relative group p-1 bg-white/5 shadow-2xl">
                                <img src={newEvent.bannerUrl} alt="Tactical Preview" className="w-full h-full object-cover rounded-[2.2rem] opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 ml-8 italic">Tactical Date</label>
                            <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 outline-none font-black text-white focus:border-blue-500/50 transition-all shadow-inner uppercase tracking-widest" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 ml-8 italic">Classification Type</label>
                            <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})} className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 outline-none font-black text-white focus:border-blue-500/50 transition-all shadow-inner uppercase tracking-widest appearance-none">
                                <option value="Free">UNRESTRICTED (FREE)</option>
                                <option value="Paid">RESTRICTED (PAID)</option>
                            </select>
                        </div>
                    </div>

                    {newEvent.type === 'Paid' && (
                        <div className="p-10 rounded-[3rem] bg-amber-500/5 border border-amber-500/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/70 ml-8">REGISTRATION SURCHARGE (₹)</label>
                                <input required type="number" value={newEvent.fee} onChange={e => setNewEvent({...newEvent, fee: Number(e.target.value)})} className="w-full px-8 py-5 rounded-3xl bg-black/40 border border-amber-500/20 outline-none font-black text-amber-500 shadow-inner text-2xl tracking-tighter" />
                            </div>
                            <div className="flex items-start gap-4 text-[9px] font-black text-amber-500/50 leading-relaxed uppercase tracking-widest">
                                <AlertCircle size={18} className="shrink-0" />
                                <p>Restricted access requires an active financial gateway (UPI QR) in sector control. Failure to link will result in mission abort.</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-10 border-t border-white/5">
                        <div className="flex justify-between items-center mb-8 px-4">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">CLEARANCE LEVEL</span>
                               <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDirectApprovalEnabled ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {isDirectApprovalEnabled ? 'Level-S (Instant Deployment)' : 'Level-B (Subject to Review)'}
                               </span>
                            </div>
                            <Activity size={24} className={isDirectApprovalEnabled ? 'text-emerald-500' : 'text-amber-400'} />
                        </div>
                        <div className="flex gap-6">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] text-slate-600 hover:text-white hover:bg-white/5 transition-all active:scale-95 shadow-lg border border-transparent hover:border-white/5">CANCEL MISSION</button>
                            <button 
                            type="submit" 
                            className={`flex-1 py-5 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 ${
                                isDirectApprovalEnabled ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-blue-600 shadow-blue-500/30'
                            }`}
                            >
                            {isDirectApprovalEnabled ? <><ShieldCheck size={20}/> DEPLOY TO SECTOR</> : <><Send size={20}/> DISPATCH PROPOSAL</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventOperations;
