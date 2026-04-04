
import React, { useState } from 'react';
import { Event, Club, CertificateBatch, Role } from '../../types';
import { Clock, Check, X, ShieldCheck, Zap, AlertCircle, Calendar, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  events: Event[];
  clubs: Club[];
  batches: CertificateBatch[];
  currentUser: any;
  onApproveEvent: (id: string) => void;
  onApproveBatch: (batch: CertificateBatch) => void;
  onRejectBatch: (batch: CertificateBatch) => void;
}

const FacultyOversight: React.FC<Props> = ({ events, clubs, batches, currentUser, onApproveEvent, onApproveBatch, onRejectBatch }) => {
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'certificates'>('events');
  
  const pendingEvents = events.filter(e => e.status === 'Pending');
  const pendingBatches = batches.filter(b => {
      if (currentUser?.globalRole === Role.FACULTY) return b.status === 'PendingFaculty';
      if (currentUser?.globalRole === Role.DEAN) return b.status === 'PendingDean';
      return false;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight">Institutional Approvals</h1>
            <p className="text-[#A3AED0] font-medium text-lg italic">Strategic oversight and verification of proposed campus pulses.</p>
        </div>
        
        <div className="flex bg-[#111C44] p-1.5 rounded-[1.5rem] border border-white/5">
            <button 
                onClick={() => setActiveSubTab('events')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'events' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-[#A3AED0] hover:text-white'}`}
            >
                <Calendar size={16} /> Events ({pendingEvents.length})
            </button>
            <button 
                onClick={() => setActiveSubTab('certificates')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'certificates' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-[#A3AED0] hover:text-white'}`}
            >
                <Award size={16} /> Certificates ({pendingBatches.length})
            </button>
        </div>
      </header>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {activeSubTab === 'events' ? <Clock size={20} /> : <Award size={20} />}
          </div>
          <h2 className="text-xl font-black uppercase tracking-[0.2em] opacity-60">
            {activeSubTab === 'events' ? `Pending Ledger Review (${pendingEvents.length})` : `Certificate Authentication Queue (${pendingBatches.length})`}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeSubTab === 'events' ? (
              pendingEvents.length === 0 ? (
                <div className="col-span-2 p-24 bg-[#111C44] border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-4">
                  <ShieldCheck size={48} className="mx-auto text-[#A3AED0] opacity-20" />
                  <p className="text-xl font-black opacity-30 uppercase tracking-widest">Protocol Clear: No pending events.</p>
                </div>
              ) : (
                pendingEvents.map(e => {
                  const club = clubs.find(c => c.id === e.clubId);
                  return (
                    <div key={e.id} className="bg-[#111C44] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all">
                        <Zap size={100} style={{ color: club?.themeColor || 'var(--primary)' }} />
                      </div>

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: club?.themeColor || 'var(--primary)' }}>
                            {club?.name[0]}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#A3AED0]">Origin Council</span>
                            <h4 className="font-bold text-white">{club?.name}</h4>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                          Proposed {e.date}
                        </span>
                      </div>

                      <div className="space-y-4 mb-10 relative z-10">
                        <h3 className="text-3xl font-black tracking-tighter text-white leading-tight">{e.title}</h3>
                        <p className="text-[#A3AED0] text-sm font-medium leading-relaxed italic line-clamp-3">"{e.description}"</p>
                      </div>

                      <div className="flex gap-4 relative z-10">
                        <button 
                          onClick={() => onApproveEvent(e.id)} 
                          className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={20}/> Authenticate
                        </button>
                        <button className="p-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                          <X size={24}/>
                        </button>
                      </div>
                    </div>
                  );
                })
              )
          ) : (
                pendingBatches.length === 0 ? (
                <div className="col-span-2 p-24 bg-[#111C44] border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-4">
                  <Award size={48} className="mx-auto text-[#A3AED0] opacity-20" />
                  <p className="text-xl font-black opacity-30 uppercase tracking-widest">Safe Haven: No batches awaiting signature.</p>
                </div>
              ) : (
                pendingBatches.map(b => {
                  const club = clubs.find(c => c.id === b.clubId);
                  const event = events.find(e => e.id === b.eventId);
                  return (
                    <div key={b.id} className="bg-[#111C44] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                       <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: club?.themeColor || 'var(--primary)' }}>
                            {club?.name[0]}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#A3AED0]">Issuing Club</span>
                            <h4 className="font-bold text-white">{club?.name}</h4>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full border border-blue-400/20">
                                {b.certificates.length} Recipients
                            </span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ID: {b.id.slice(0, 8)}</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8 relative z-10">
                         <h3 className="text-2xl font-black tracking-tight text-white leading-tight">Certificates for {event?.title}</h3>
                         <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 font-medium italic">
                             "Verification of student participation and excellence in {event?.title} conducted on {event?.date}."
                         </div>
                      </div>

                      <div className="flex gap-4 relative z-10">
                         <button 
                            onClick={() => onApproveBatch(b)}
                            className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                         >
                            <CheckCircle2 size={20}/> Approve & Sign
                         </button>
                         <button 
                            onClick={() => onRejectBatch(b)}
                            className="p-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                         >
                            <X size={24}/>
                         </button>
                      </div>
                    </div>
                  );
                })
              )
          )}
        </div>
      </div>
      
      <div className="p-8 rounded-[2.5rem] border border-white/5 bg-primary/5 flex items-start gap-6">
        <AlertCircle className="text-primary mt-1" size={24} />
        <div>
          <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-2">Institutional Protocol Notice</h4>
          <p className="text-xs text-[#A3AED0] font-medium leading-relaxed max-w-2xl">
            As a faculty coordinator, your digital signature on event proposals triggers the automated ticketing ledger and opens recruitment pipelines. Ensure all proposals align with the Madhav Institute code of conduct before authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyOversight;
