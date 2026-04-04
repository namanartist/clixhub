import React, { useState, useMemo, useRef } from 'react';
import { Club, Registration, Event, User, ClubRole, CertificateTemplate, CertificateConfig, CertificateBatch, Role, ApprovalStep, IssuedCertificate } from '../../types';
import CertificatePreview from '../CertificatePreview';
import { db } from '../../db';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  Search, 
  Filter, 
  Download, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Save, 
  AlertTriangle,
  Printer,
  History,
  FileText,
  Check,
  X,
  Plus,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Zap,
  Fingerprint,
  ChevronRight,
  ShieldAlert,
  Edit3,
  Award,
  Database,
  SearchCode
} from 'lucide-react';

interface Props {
  club: Club;
  registrations: Registration[];
  events: Event[];
  batches: CertificateBatch[];
  currentUser: User;
  allUsers: User[];
  onRefreshBatch: () => void;
}

const CertificationGovernance: React.FC<Props> = ({ 
  club, 
  registrations, 
  events, 
  batches, 
  currentUser, 
  allUsers,
  onRefreshBatch 
}) => {
  const [activeTab, setActiveTab] = useState<'issuance' | 'approval' | 'issued' | 'design'>('issuance');
  
  // Issuance State
  const [activeEventId, setActiveEventId] = useState<string>(events[0]?.id || '');
  const [selectedRegs, setSelectedRegs] = useState<Set<string>>(new Set());
  const [isMinting, setIsMinting] = useState(false);
  const [activePrintId, setActivePrintId] = useState<string | null>(null);
  const [mintProgress, setMintProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Design Studio State
  const [designConfig, setDesignConfig] = useState<CertificateConfig>(club.certificateConfig || {
      templateId: 'classic',
      showClubLogo: true,
      showMITSLogo: true,
      signatureTextFaculty: 'Faculty Coordinator',
      signatureTextPresident: 'Club President'
  });
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Filtering
  const clubBatches = useMemo(() => batches.filter(b => b.clubId === club.id), [batches, club.id]);
  const currentEventRegs = useMemo(() => registrations.filter(r => r.eventId === activeEventId), [registrations, activeEventId]);
  const activeEvent = events.find(e => e.id === activeEventId);
  const eligible = currentEventRegs.filter(r => r.attendanceMarked && !r.certificateId);
  
  // Find Signatories
  const president = allUsers.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
  const faculty = allUsers.find(u => 
    (club.facultyCoordinatorNames?.includes(u.name)) || 
    (u.globalRole === Role.FACULTY)
  );

  const missingSignatures = !president?.signatureUrl || !faculty?.signatureUrl;

  // --- ACTIONS ---

  const handlePrint = (serial?: string) => {
    if (serial) {
        setActivePrintId(serial);
        setTimeout(() => {
            window.print();
            setActivePrintId(null);
        }, 100);
    } else {
        // Bulk print logic
        window.print();
    }
  };

  const handleSaveDesign = async () => {
    const updatedClub = { ...club, certificateConfig: designConfig };
    await db.updateClub(updatedClub);
    alert("Certificate template updated successfully.");
  };

  const handleCreateBatch = async () => {
    if (selectedRegs.size === 0) return;
    setIsMinting(true);
    setMintProgress(0);

    const total = selectedRegs.size;
    const interval = setInterval(() => {
        setMintProgress(prev => {
            const next = prev + (100 / total);
            return next > 100 ? 100 : next;
        });
    }, 50);

    await new Promise(resolve => setTimeout(resolve, 1500));
    clearInterval(interval);

    const certs: IssuedCertificate[] = Array.from(selectedRegs).map(regId => {
      const reg = registrations.find(r => r.id === regId)!;
      return {
        serialNumber: 'PENDING',
        studentId: reg.studentId,
        studentName: reg.studentName,
        enrollmentNumber: reg.studentRoll,
        eventName: activeEvent?.title || 'Unknown Event',
        clubId: club.id,
        clubName: club.name,
        date: activeEvent?.date || new Date().toISOString(),
        hash: 'PENDING',
        batchId: `batch-${Date.now()}`
      };
    });

    const newBatch: CertificateBatch = {
      id: `batch-${Date.now()}`,
      clubId: club.id,
      eventId: activeEventId,
      templateId: designConfig.templateId,
      status: 'PendingFaculty',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      certificates: certs,
      approvalChain: [
        { role: Role.FACULTY, approverName: faculty?.name || 'Faculty Coordinator', status: 'Pending' },
        { role: Role.DEAN, approverName: 'Dean Student Welfare', status: 'Pending' }
      ]
    };

    await db.saveBatch(newBatch);
    onRefreshBatch();
    
    // Update registrations locally or via DB to mark as PENDING certificate
    // In demo, we just rely on onRefreshBatch
    
    setIsMinting(false);
    setSelectedRegs(new Set());
    setActiveTab('approval');
    alert("Batch submitted for approval.");
  };

  const handleApproveBatch = async (batch: CertificateBatch) => {
    const isFaculty = currentUser.globalRole === Role.FACULTY || currentUser.globalRole === Role.SUPER_ADMIN;
    const isDean = currentUser.globalRole === Role.DEAN || currentUser.globalRole === Role.SUPER_ADMIN;

    const updatedBatch = { ...batch };
    
    if (batch.status === 'PendingFaculty' && isFaculty) {
      updatedBatch.status = 'PendingDean';
      updatedBatch.approvalChain[0].status = 'Approved';
      updatedBatch.approvalChain[0].approvedAt = new Date().toISOString();
      updatedBatch.approvalChain[0].approverName = currentUser.name;
    } else if (batch.status === 'PendingDean' && isDean) {
      updatedBatch.status = 'Approved';
      updatedBatch.approvalChain[1].status = 'Approved';
      updatedBatch.approvalChain[1].approvedAt = new Date().toISOString();
      updatedBatch.approvalChain[1].approverName = currentUser.name;

      // Generate serial numbers and hashes for all certificates in the batch
      updatedBatch.certificates = updatedBatch.certificates.map((cert, idx) => {
        const serial = `MITS-${club.id.split('-')[1].toUpperCase()}-${new Date().getFullYear()}-${String(clubBatches.length * 100 + idx + 1).padStart(5, '0')}`;
        const hashPayload = `${serial}|${cert.studentName}|${cert.eventName}|${updatedBatch.createdAt}`;
        // Simple hash mock
        const hash = Array.from(hashPayload).reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).padEnd(64, '0');
        return { ...cert, serialNumber: serial, hash };
      });
    }

    await db.saveBatch(updatedBatch);
    onRefreshBatch();
  };

  const handleRejectBatch = async (batch: CertificateBatch) => {
    const updatedBatch = { ...batch, status: 'Rejected' as const };
    const stepIdx = batch.status === 'PendingFaculty' ? 0 : 1;
    updatedBatch.approvalChain[stepIdx].status = 'Rejected';
    updatedBatch.approvalChain[stepIdx].approvedAt = new Date().toISOString();
    updatedBatch.approvalChain[stepIdx].approverName = currentUser.name;
    
    await db.saveBatch(updatedBatch);
    onRefreshBatch();
  };



  // Preview Data
  const previewRegId = Array.from(selectedRegs)[0] || eligible[0]?.id;
  const previewReg = registrations.find(r => r.id === previewRegId);

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-12 md:space-y-16 relative z-10 animate-in fade-in duration-700">
      
      {/* Governance Header */}
      <header className="flex flex-col xl:flex-row justify-between items-end gap-10">
         <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
               <ShieldCheck size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Registry Governance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-display leading-[0.9] text-white">
            Certification <span className="text-emerald-500">Vault</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm max-w-lg leading-relaxed italic">
            Institutional credentialing matrix • Secure minting protocols and multi-signature validation pipelines.
          </p>
         </div>

         <nav className="flex items-center p-2 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
            {[
              { id: 'issuance', label: 'Issuance', icon: Plus },
              { id: 'approval', label: 'Workflows', icon: Activity },
              { id: 'issued', label: 'Archive', icon: Database },
              { id: 'design', label: 'Studio', icon: Palette }
            ].map(tab => (
              <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95 ${
                    activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                  <tab.icon size={16} /> {tab.label}
              </button>
            ))}
         </nav>
      </header>

      {activeTab === 'issuance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* Operative Selection & Attendee Matrix */}
          <div className="lg:col-span-7 space-y-10">
              
              {/* Tactical Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-elevated p-4 rounded-[2rem] border border-white/5 flex items-center gap-4 group hover:border-white/10 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                      <Layout size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Mission Node</p>
                      <select 
                          value={activeEventId} 
                          onChange={(e) => { setActiveEventId(e.target.value); setSelectedRegs(new Set()); }}
                          className="bg-transparent font-black tracking-tighter text-white outline-none cursor-pointer w-full text-lg appearance-none"
                      >
                          {events.map(e => <option key={e.id} value={e.id} className="bg-[#0b0f1a]">{e.title}</option>)}
                      </select>
                    </div>
                </div>

                <div className="glass-elevated p-4 rounded-[2rem] border border-white/5 flex items-center gap-4 group hover:border-white/10 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:rotate-12 transition-transform">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Sync Status</p>
                      <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Automation Nominal</p>
                    </div>
                </div>
              </div>

              {missingSignatures && (
                  <div className="glass-elevated p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 flex items-start gap-6 group">
                      <ShieldAlert size={28} className="text-rose-500 shrink-0 mt-1 animate-pulse" />
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 bg-rose-500/5 px-4 py-1.5 rounded-full border border-rose-500/10 inline-block">Security Block: 102</h4>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed italic uppercase tracking-widest opacity-80">Credential assembly halted. Missing digital signatures from Faculty Liaison or Club Presidency. Resolve via Identity Hub.</p>
                      </div>
                  </div>
              )}

              {/* Data Ledger */}
              <div className="glass-elevated rounded-[3.5rem] border border-white/5 flex flex-col relative overflow-hidden h-[650px] shadow-2xl">
                  {isMinting && (
                      <div className="absolute inset-0 z-[100] bg-[#02040a]/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                          <div className="relative w-32 h-32 mb-10">
                            <Loader2 size={128} className="text-emerald-500 animate-spin absolute inset-0 opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Award size={48} className="text-emerald-500 animate-bounce" />
                            </div>
                          </div>
                          <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Minting Credentials</h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 italic">Assembling cryptographic proof-of-completion...</p>
                          <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300" style={{ width: `${mintProgress}%` }} />
                          </div>
                      </div>
                  )}

                  <div className="p-10 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.01]">
                      <div className="relative flex-1 w-full">
                          <SearchCode className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" size={20} />
                          <input 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="SEARCH CADET IDENTITIES..."
                              className="w-full pl-16 pr-8 py-5 rounded-3xl bg-white/[0.02] border border-white/5 outline-none font-black text-sm text-white tracking-widest placeholder:text-slate-700 focus:border-emerald-500/30 transition-all shadow-inner"
                          />
                      </div>
                      <button 
                          onClick={() => setSelectedRegs(selectedRegs.size === eligible.length ? new Set() : new Set(eligible.map(r => r.id)))}
                          className="px-10 py-5 rounded-3xl border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                      >
                          {selectedRegs.size === eligible.length && eligible.length > 0 ? 'Wipe Selection' : 'Batch Align'}
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                      {currentEventRegs
                          .filter(r => r.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(reg => (
                          <div 
                              key={reg.id}
                              onClick={() => !reg.certificateId && setSelectedRegs(prev => { const n = new Set(prev); n.has(reg.id) ? n.delete(reg.id) : n.add(reg.id); return n; })}
                              className={`p-6 rounded-[2.2rem] border transition-all cursor-pointer group flex items-center justify-between ${
                                  selectedRegs.has(reg.id) 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-xl shadow-emerald-500/5' 
                                  : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                              } ${reg.certificateId ? 'opacity-30 pointer-events-none filter grayscale' : ''}`}
                          >
                              <div className="flex items-center gap-6">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${
                                    selectedRegs.has(reg.id) 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 rotate-12' 
                                    : 'bg-white/5 text-slate-500 group-hover:scale-110'
                                  }`}>
                                      {selectedRegs.has(reg.id) ? <Check size={24} strokeWidth={4} /> : reg.studentName[0]}
                                  </div>
                                  <div className="space-y-1">
                                      <p className="font-black text-xl text-white tracking-tight leading-none uppercase">{reg.studentName}</p>
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{reg.studentRoll}</p>
                                  </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {reg.certificateId ? (
                                  <div className="px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl border border-blue-500/20 italic">
                                     Vault Record Active
                                  </div>
                                ) : reg.attendanceMarked ? (
                                  <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl border border-emerald-500/20">
                                     Eligible Node
                                  </div>
                                ) : (
                                  <div className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl border border-rose-500/20">
                                     Training Incomplete
                                  </div>
                                )}
                                {selectedRegs.has(reg.id) && (
                                  <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                    <Fingerprint size={10} /> Queued
                                  </div>
                                )}
                              </div>
                          </div>
                      ))}
                      {currentEventRegs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-8 p-20">
                           <Layers size={64} className="text-slate-500" />
                           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Mission Registry Empty • No Operatives Found</p>
                        </div>
                      )}
                  </div>

                  <div className="p-10 border-t border-white/5 bg-white/[0.01]">
                      <button 
                          onClick={handleCreateBatch}
                          disabled={selectedRegs.size === 0 || missingSignatures}
                          className={`w-full py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 ${
                            selectedRegs.size > 0 && !missingSignatures 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.02] shadow-emerald-500/20 border border-emerald-400/20' 
                            : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                          }`}
                      >
                          <Award size={20} /> Deploy {selectedRegs.size} Credentials to Pipeline
                      </button>
                  </div>
              </div>
          </div>

          {/* Tactical Preview */}
          <div className="lg:col-span-5 space-y-10 flex flex-col h-full">
              <div className="glass-elevated bg-[#02040a] rounded-[4rem] p-12 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex-1 flex flex-col items-center justify-center relative overflow-hidden group min-h-[600px]">
                  <div className="absolute top-12 left-12 flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Assembly Monitor</span>
                  </div>
                  
                  <div className="w-full transform transition-all group-hover:scale-[1.05] group-hover:-rotate-1 duration-1000">
                      <CertificatePreview 
                          studentName={previewReg?.studentName || "CANDIDATE NAME"}
                          enrollmentNumber={previewReg?.studentRoll || "MITS-ROLL-000"}
                          eventName={activeEvent?.title || "TACTICAL EXERCISE"}
                          clubName={club.name}
                          clubLogoUrl={club.logoUrl}
                          id="DRAFT-ALPHA-92"
                          date={activeEvent?.date}
                          facultySignature={faculty?.signatureUrl}
                          presidentSignature={president?.signatureUrl}
                          template={designConfig.templateId}
                          customBackgroundUrl={designConfig.customBackgroundUrl}
                          themeColor={club.themeColor}
                      />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                       <div className="flex items-center justify-between">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Signature Protocol</p>
                             <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Validating Cryptographic Signatures...</p>
                          </div>
                          <div className="flex gap-3">
                             {president?.signatureUrl && <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Fingerprint size={14} /></div>}
                             {faculty?.signatureUrl && <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500"><ShieldCheck size={14} /></div>}
                          </div>
                       </div>
                  </div>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 animate-in slide-in-from-bottom-6 duration-700">
            {clubBatches.length === 0 && (
              <div className="col-span-full h-[500px] glass-elevated rounded-[4rem] border border-white/5 flex flex-col items-center justify-center space-y-8 opacity-20">
                <Clock className="text-slate-500" size={64} />
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">No Active Approval Pipelines</p>
              </div>
            )}
            {clubBatches.map(batch => (
              <div key={batch.id} className="glass-elevated bg-white/[0.01] rounded-[3.5rem] p-10 border border-white/5 flex flex-col gap-10 group hover:bg-white/[0.03] transition-all relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase font-display leading-[0.9]">
                      {events.find(e => e.id === batch.eventId)?.title || "Unknown Mission"}
                    </h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{batch.certificates.length} RECIPIENTS</span>
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-40 italic">{new Date(batch.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                    batch.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10' :
                    batch.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10 animate-pulse'
                  }`}>
                    {batch.status.replace('Pending', 'Awaiting ')}
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] flex items-center gap-3">
                    <ShieldCheck size={14} className="text-blue-500" /> Multi-Signature Chain
                  </p>
                  <div className="space-y-4">
                    {batch.approvalChain.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/step">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                          step.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' : 
                          step.status === 'Rejected' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20' : 
                          'bg-white/5 text-slate-600 border border-white/5 border-dashed animate-pulse'
                        }`}>
                          {step.status === 'Approved' ? <CheckCircle2 size={18}/> : step.status === 'Rejected' ? <X size={18}/> : <Fingerprint size={18}/>}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-white uppercase tracking-tighter leading-none">{step.approverName}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-60 italic">{step.role} <span className="mx-2 opacity-30">•</span> {step.status}</p>
                        </div>
                        {step.approvedAt && (
                          <span className="text-[8px] font-black text-slate-700 uppercase">{new Date(step.approvedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5 flex gap-4 relative z-10">
                  {(batch.status === 'PendingFaculty' && (currentUser.globalRole === Role.FACULTY || currentUser.globalRole === Role.SUPER_ADMIN)) ||
                   (batch.status === 'PendingDean' && (currentUser.globalRole === Role.DEAN || currentUser.globalRole === Role.SUPER_ADMIN)) ? (
                    <>
                      <button 
                        onClick={() => handleApproveBatch(batch)}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 hover:scale-[1.05] transition-all shadow-2xl shadow-emerald-500/30 border border-emerald-400/20 flex items-center justify-center gap-2"
                      >
                         Authorize
                      </button>
                      <button 
                        onClick={() => handleRejectBatch(batch)}
                        className="px-6 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                      >
                        Abuse
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-4 bg-white/[0.02] border border-white/5 text-slate-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 italic">
                      <Clock size={14} className="animate-spin-slow" /> Protocol Execution Continuous
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'issued' && (
        <div className="glass-elevated rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.01]">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase font-display leading-[0.9]">Institutional Ledger</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 italic">Cryptographically verified and immutable record entries.</p>
            </div>
            <button onClick={() => handlePrint()} className="px-10 py-5 bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-3">
              <Printer size={18}/> Bulk Export Ledger
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 border-b border-white/5 opacity-40">
                  <th className="px-10 py-8">OPERATIVE IDENTITY</th>
                  <th className="px-10 py-8">MISSION NODE</th>
                  <th className="px-10 py-8">VAULT SERIAL</th>
                  <th className="px-10 py-8">DIGITAL FINGERPRINT</th>
                  <th className="px-10 py-8 text-right">MANEUVERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {clubBatches.filter(b => b.status === 'Approved').flatMap(b => b.certificates).map(cert => (
                  <tr key={cert.serialNumber} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black group-hover:rotate-12 transition-transform shadow-lg border border-blue-500/20">
                          {cert.studentName[0]}
                        </div>
                        <div>
                          <p className="font-black text-lg text-white tracking-tight uppercase">{cert.studentName}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{cert.enrollmentNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-black text-sm text-slate-400 uppercase tracking-tighter group-hover:text-blue-500 transition-colors">{cert.eventName}</td>
                    <td className="px-10 py-8">
                      <code className="text-[10px] font-black bg-blue-500/10 px-4 py-2 rounded-xl text-blue-500 border border-blue-500/20 shadow-inner">{cert.serialNumber}</code>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                        <Fingerprint size={12} className="text-emerald-500" />
                        <code className="text-[9px] font-mono text-slate-500 truncate max-w-[150px] block">{cert.hash}</code>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => handlePrint(cert.serialNumber)}
                        className="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center border border-white/5"
                      >
                        <Download size={20}/>
                      </button>
                      
                      {activePrintId === cert.serialNumber && (
                        <div id="certificate-print-area" className="fixed inset-0 z-[-1] opacity-0 pointer-events-none">
                             <CertificatePreview 
                                studentName={cert.studentName}
                                enrollmentNumber={cert.enrollmentNumber}
                                eventName={cert.eventName}
                                clubName={cert.clubName}
                                id={cert.serialNumber}
                                date={cert.date}
                                template={designConfig.templateId}
                            />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {clubBatches.filter(b => b.status === 'Approved').length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-6 opacity-20">
                          <Layers size={56} className="text-slate-500" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Vault Empty • No Verified Records Found</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 animate-in slide-in-from-bottom-6 duration-700">
              <div className="lg:col-span-4 space-y-10">
                  <div className="glass-elevated bg-white/[0.01] rounded-[3.5rem] p-10 border border-white/5 space-y-10 shadow-2xl">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/20">
                         <Palette size={20} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-xl font-black text-white tracking-tighter uppercase font-display leading-[0.9]">Design Matrix</h3>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest italic">Template Personalization Protocols</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-6 italic">Architecture Node</label>
                        <div className="grid grid-cols-2 gap-4">
                            {(['classic', 'modern', 'tech', 'elegant', 'minimal'] as CertificateTemplate[]).map(t => (
                                <button 
                                  key={t} 
                                  onClick={() => setDesignConfig({ ...designConfig, templateId: t })}
                                  className={`p-6 rounded-[1.8rem] border text-left transition-all relative overflow-hidden group ${
                                      designConfig.templateId === t 
                                      ? 'bg-blue-600 text-white border-blue-400 shadow-[0_15px_30px_rgba(59,130,246,0.3)]' 
                                      : 'bg-white/[0.02] border-white/10 hover:border-blue-500/50 hover:bg-white/[0.04]'
                                  }`}
                                >
                                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] relative z-10">{t}</span>
                                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 bg-white/10 blur-xl rounded-full transition-opacity ${designConfig.templateId === t ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-6 italic flex items-center gap-3">
                          <ImageIcon size={14} /> Background Matrix Asset
                        </label>
                        <div 
                          onClick={() => bgInputRef.current?.click()}
                          className="h-44 border-2 border-dashed border-white/5 bg-white/[0.01] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] hover:border-blue-500/50 transition-all overflow-hidden group shadow-inner"
                        >
                            {designConfig.customBackgroundUrl ? (
                                <div className="relative w-full h-full">
                                   <img src={designConfig.customBackgroundUrl} className="h-full w-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Edit3 size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-blue-600/20 group-hover:scale-110 transition-all">
                                       <Plus className="text-slate-500 group-hover:text-blue-500" size={24} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block">Inject Spatial Asset</span>
                                </div>
                            )}
                            <input type="file" ref={bgInputRef} onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                  try {
                                      const url = await db.uploadAsset(file, `backgrounds/${club.id}/${Date.now()}_${file.name}`);
                                      setDesignConfig({ ...designConfig, customBackgroundUrl: url });
                                  } catch (error) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => setDesignConfig({ ...designConfig, customBackgroundUrl: reader.result as string });
                                      reader.readAsDataURL(file);
                                  }
                              }
                            }} className="hidden" accept="image/*" />
                        </div>
                        {designConfig.customBackgroundUrl && (
                            <button onClick={() => setDesignConfig({...designConfig, customBackgroundUrl: undefined})} className="text-[10px] text-rose-500 font-black uppercase tracking-[0.3em] hover:text-rose-400 transition-colors block mx-auto py-2">Purge Asset Record</button>
                        )}
                    </div>

                    <button 
                      onClick={handleSaveDesign}
                      className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all border border-blue-400/20 flex items-center justify-center gap-4"
                    >
                        <Save size={20} /> Update Governance Config
                    </button>
                  </div>
              </div>

              <div className="lg:col-span-8 glass-elevated bg-[#02040a] rounded-[4rem] p-16 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden group min-h-[700px]">
                  <div className="absolute top-12 right-12 flex items-center gap-4 opacity-40">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Integrated Studio Output</span>
                  </div>
                  <div className="w-full max-w-4xl transform transition-all group-hover:scale-[1.03] group-hover:rotate-1 duration-1000 shadow-2xl">
                      <CertificatePreview 
                          studentName="PREVIEW IDENTIFIER"
                          enrollmentNumber="MITS-ROLL-PROTO"
                          eventName="PHASE-GATE WORKSHOP"
                          clubName={club.name}
                          clubLogoUrl={club.logoUrl}
                          id="STUDIO-PROTO-O"
                          date={new Date().toISOString()}
                          facultySignature={faculty?.signatureUrl}
                          presidentSignature={president?.signatureUrl}
                          template={designConfig.templateId}
                          customBackgroundUrl={designConfig.customBackgroundUrl}
                          themeColor={club.themeColor}
                      />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CertificationGovernance;
