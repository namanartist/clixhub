import React, { useState, useEffect } from 'react';
import { Registration, Event, Club, Quotation, PaymentGatewayConfig } from '../../types';
import { db } from '../../db';
import { 
  Plus, 
  Globe, 
  Check, 
  X, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  QrCode, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle2, 
  DollarSign,
  Briefcase,
  CreditCard,
  Settings,
  Eye,
  EyeOff,
  Save,
  Activity,
  ChevronRight,
  Fingerprint,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  club: Club;
  registrations: Registration[];
  events: Event[];
  onApprovePayment: (id: string) => void;
  onUpdateQuotes: (quotes: Quotation[]) => void;
  onUpdateQr: (url: string) => void;
  isDarkMode: boolean;
  isFaculty?: boolean;
}

const ClubFinance: React.FC<Props> = ({ 
  club, 
  registrations, 
  events, 
  onApprovePayment, 
  onUpdateQuotes, 
  onUpdateQr,
  isDarkMode,
  isFaculty = false
}) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ title: '', vendor: '', amount: 0, desc: '' });
  
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(
    club.paymentGatewayConfig || { provider: 'ManualUPI', isActive: true, apiKey: '', secretKey: '', merchantId: '' }
  );
  const [showSecrets, setShowSecrets] = useState(false);
  const [isGatewaySaving, setIsGatewaySaving] = useState(false);

  const financeRegs = registrations.filter(r => r.paymentType === 'UPI' || r.paymentType === 'Gateway');
  
  const totalRevenue = financeRegs
    .filter(r => r.status === 'Approved')
    .reduce((acc, r) => {
        const eventFee = events.find(e => e.id === r.eventId)?.fee || 0;
        return acc + eventFee;
    }, 0);

  const pendingAmount = financeRegs
    .filter(r => r.status === 'Pending')
    .reduce((acc, r) => {
        const eventFee = events.find(e => e.id === r.eventId)?.fee || 0;
        return acc + eventFee;
    }, 0);

  const handleAddQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const quote: Quotation = {
      id: `q-${Date.now()}`,
      title: newQuote.title,
      vendorName: newQuote.vendor,
      amount: Number(newQuote.amount),
      description: newQuote.desc,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    onUpdateQuotes([...(club.quotations || []), quote]);
    setIsQuoteModalOpen(false);
    setNewQuote({ title: '', vendor: '', amount: 0, desc: '' });
  };

  const handleApproveQuotation = (id: string) => {
    const updated = (club.quotations || []).map(q => q.id === id ? { ...q, status: 'Approved' as const } : q);
    onUpdateQuotes(updated);
  };

  const handleRejectQuotation = (id: string) => {
    const updated = (club.quotations || []).map(q => q.id === id ? { ...q, status: 'Rejected' as const } : q);
    onUpdateQuotes(updated);
  };

  const handleQrUpload = () => {
    const url = prompt("Enter Direct UPI QR Asset URL (HTTPS recommend):", club.defaultUpiQrUrl || '');
    if (url) onUpdateQr(url);
  };

  const handleSaveGatewayConfig = async () => {
    setIsGatewaySaving(true);
    try {
        await db.updateClub({
            ...club,
            paymentGatewayConfig: gatewayConfig
        });
        alert("Financial Infrastructure Matrix Updated.");
    } catch (e) {
        alert("Matrix sync failed.");
    }
    setIsGatewaySaving(false);
  };

  return (
    <div className="p-6 md:p-12 max-w-[1700px] mx-auto space-y-12 md:space-y-16 relative z-10 animate-in fade-in duration-700">
      
      {/* Treasury Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
         <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
               <Wallet size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Fiscal Governance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-display leading-[0.9] text-white">
            Treasury <span className="text-blue-600">&</span> Ledger
          </h1>
          <p className="text-slate-500 font-bold text-sm max-w-lg leading-relaxed italic">
            Institutional solvency monitoring • Validating high-throughput financial streams and procurement nodes.
          </p>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleQrUpload}
              className="flex-1 md:flex-none glass-elevated border border-white/5 text-white px-8 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 hover:bg-white/ transition-all active:scale-95"
            >
              <QrCode size={18} /> Gateway Assets
            </button>
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="flex-1 md:flex-none bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} /> New Quotation
            </button>
         </div>
      </header>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {[
          { label: 'Verified Revenue Stream', val: totalRevenue, icon: Sparkles, color: 'emerald', sub: 'Net Validated Credits' },
          { label: 'Pending Verification', val: pendingAmount, icon: Clock, color: 'amber', sub: 'Locked Assets (Awaiting Audit)' },
          { label: 'Procurement Capacity', val: (club.quotations || []).filter(q => q.status === 'Approved').reduce((a, b) => a + b.amount, 0), icon: Briefcase, color: 'blue', sub: 'Approved Capital Budget' }
        ].map((kpi, i) => (
          <div key={i} className="glass-elevated p-10 rounded-[3.5rem] border transition-all duration-700 hover:scale-[1.02] flex flex-col justify-between h-64 group shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/ blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex justify-between items-start relative z-10">
                 <div className={`w-16 h-16 rounded-2xl bg-${kpi.color}-500/10 text-${kpi.color}-500 flex items-center justify-center transition-transform duration-700 group-hover:rotate-12`}>
                     <kpi.icon size={28} />
                 </div>
                 <Activity size={18} className="text-slate-500 opacity-20" />
             </div>
             <div className="space-y-1 relative z-10">
                 <p className="text-5xl font-black font-display text-white tracking-tighter">₹{kpi.val}</p>
                 <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{kpi.label}</p>
                    <div className={`w-1 h-1 rounded-full bg-${kpi.color}-500 shadow-[0_0_8px_#${kpi.color === 'emerald' ? '10b981' : kpi.color === 'amber' ? 'f59e0b' : '3b82f6'}]`} />
                 </div>
                 <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2 font-mono italic">{kpi.sub}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 md:gap-14">
        {/* Transaction Matrix */}
        <div className="xl:col-span-2 glass-elevated rounded-[4rem] border overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white font-display tracking-tighter uppercase">Transaction Matrix</h3>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Awaiting Manual Verification Protocols</p>
              </div>
              <div className="flex items-center gap-3 bg-amber-500/10 text-amber-500 px-6 py-2.5 rounded-2xl border border-amber-500/20">
                 <Activity size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Queue: {financeRegs.filter(r => r.status === 'Pending').length}</span>
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 border-b border-white/5 opacity-40">
                  <th className="px-10 py-8">OPERATIVE IDENTITY</th>
                  <th className="px-10 py-8 text-center">MISSION NODE</th>
                  <th className="px-10 py-8">FINANCIAL PROOF</th>
                  <th className="px-10 py-8 text-right">AUDIT MANEUVER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {financeRegs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-6 opacity-20">
                          <Layers size={56} className="text-slate-500" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Ledger Empty • Registry System Passive</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  financeRegs.map(reg => {
                    const event = events.find(e => e.id === reg.eventId);
                    return (
                    <tr key={reg.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-8">
                        <p className="font-black text-lg text-white tracking-tight">{reg.studentName}</p>
                        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1 italic">{reg.studentRoll}</p>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <p className="font-black text-sm text-white group-hover:text-blue-500 transition-colors uppercase tracking-tighter">{event?.title}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">₹{event?.fee}</p>
                      </td>
                      <td className="px-10 py-8">
                        {reg.paymentType === 'Gateway' ? (
                            <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                               <Zap size={10} /> Automated Sequence
                            </span>
                        ) : (
                            <button onClick={() => window.open(reg.paymentProofUrl)} className="flex items-center gap-3 text-[10px] font-black text-blue-400 bg-blue-500/10 px-6 py-3 rounded-2xl border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95 group/btn">
                                <Globe size={16} className="group-hover/btn:rotate-12 transition-transform" /> Open Image Source
                            </button>
                        )}
                      </td>
                      <td className="px-10 py-8 text-right">
                        {reg.status === 'Pending' ? (
                          <div className="flex gap-4 justify-end">
                            <button onClick={() => onApprovePayment(reg.id)} className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center border border-emerald-500/20"><Check size={24}/></button>
                            <button className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center border border-rose-500/20"><X size={24}/></button>
                          </div>
                        ) : (
                          <div className="text-emerald-500 flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] justify-end bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20 italic">
                             <Fingerprint size={18} /> Validated Node
                          </div>
                        )}
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Control Panel */}
        <div className="space-y-10">
          
          {/* Infrastructure Matrix */}
          <div className="glass-elevated p-10 rounded-[3.5rem] border shadow-2xl space-y-8">
             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                   <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <CreditCard size={20} className="text-blue-500" /> Infrastructure Matrix
                   </h3>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Core Financial Gateway Control</p>
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6 italic">Secure Provider</label>
                    <select 
                        value={gatewayConfig.provider} 
                        onChange={(e) => setGatewayConfig({...gatewayConfig, provider: e.target.value as any})}
                        className="w-full bg-white/ border border-white/5 rounded-3xl px-6 py-4 text-white font-black text-sm outline-none focus:border-blue-500/40 transition-all appearance-none uppercase tracking-widest"
                    >
                        <option value="ManualUPI">Tactical UPI (Default)</option>
                        <option value="Razorpay">Razorpay Nexus</option>
                        <option value="Stripe">Stripe Terminal</option>
                        <option value="PhonePe">PhonePe Business Node</option>
                    </select>
                </div>

                {gatewayConfig.provider !== 'ManualUPI' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6">Access Token / API Key</label>
                            <input 
                                type="text"
                                value={gatewayConfig.apiKey || ''}
                                onChange={(e) => setGatewayConfig({...gatewayConfig, apiKey: e.target.value})}
                                placeholder="RZP_TEST_ID..."
                                className="w-full bg-white/ border border-white/5 rounded-3xl px-6 py-4 text-blue-400 font-mono text-xs outline-none focus:border-blue-500/40 shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-6 flex justify-between">
                                Secret Signature Key 
                                <button type="button" onClick={() => setShowSecrets(!showSecrets)} className="text-blue-500 hover:text-white transition-colors">{showSecrets ? 'MASK' : 'DECRYPT'}</button>
                            </label>
                            <div className="relative">
                                <input 
                                    type={showSecrets ? "text" : "password"}
                                    value={gatewayConfig.secretKey || ''}
                                    onChange={(e) => setGatewayConfig({...gatewayConfig, secretKey: e.target.value})}
                                    placeholder="••••••••••••••••"
                                    className="w-full bg-white/ border border-white/5 rounded-3xl px-6 py-4 text-white font-mono text-xs outline-none focus:border-blue-500/40 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 border border-white/5 shadow-inner ${gatewayConfig.isActive ? 'bg-emerald-600' : 'bg-slate-900}`}>
                            <div className={`w-5 h-5 rounded-full bg-whiteshadow-xl transform transition-transform duration-500 ${gatewayConfig.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <input type="checkbox" checked={gatewayConfig.isActive} onChange={(e) => setGatewayConfig({...gatewayConfig, isActive: e.target.checked})} className="hidden" />
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">Enabled Status</span>
                           <span className="text-[9px] font-black uppercase tracking-tighter text-slate-600 italic">Global Deployment</span>
                        </div>
                    </label>
                    
                    <button 
                        onClick={handleSaveGatewayConfig}
                        disabled={isGatewaySaving}
                        className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center shadow-blue-500/20 border border-blue-400/20"
                    >
                        <Save size={20} />
                    </button>
                </div>
             </div>
          </div>

          {/* Strategic Procurement Sidepanel */}
          <div className="glass-elevated p-10 rounded-[3.5rem] border shadow-2xl space-y-8">
             <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="space-y-1">
                   <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <Briefcase size={20} className="text-blue-500" /> Procurement Hub
                   </h3>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Asset Acquisition Records</p>
                </div>
             </div>
             <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                {(club.quotations || []).length === 0 ? (
                  <div className="text-center py-20 opacity-20 space-y-6 flex flex-col items-center">
                     <FileText size={48} className="text-slate-500" />
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Procurement Module Passive</p>
                  </div>
                ) : (
                  (club.quotations || []).map(quote => (
                    <div key={quote.id} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-6 group hover:bg-white/[0.06] transition-all hover:border-white/10 relative overflow-hidden">
                       <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-1">
                             <h4 className="font-black text-white text-xl tracking-tighter uppercase leading-none">{quote.title}</h4>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{quote.vendorName} <span className="mx-2 opacity-30">|</span> {quote.date}</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                            quote.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            quote.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {quote.status}
                          </span>
                       </div>
                       <div className="flex justify-between items-end relative z-10">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 italic">Acquisition Sum</p>
                             <p className="text-3xl font-black text-white font-display tracking-tight group-hover:text-blue-500 transition-colors">₹{quote.amount}</p>
                          </div>
                          {isFaculty && quote.status === 'Pending' && (
                             <div className="flex gap-4">
                                <button onClick={() => handleApproveQuotation(quote.id)} className="w-10 h-10 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90 flex items-center justify-center border border-emerald-500/20 shadow-xl"><Check size={20}/></button>
                                <button onClick={() => handleRejectQuotation(quote.id)} className="w-10 h-10 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-90 flex items-center justify-center border border-rose-500/20 shadow-xl"><X size={20}/></button>
                             </div>
                          )}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          <div className="p-10 rounded-[3.5rem] bg-blue-600/10 border border-blue-500/20 flex items-start gap-6 group hover:bg-blue-600/15 transition-all">
             <AlertCircle size={28} className="text-blue-500 shrink-0 mt-1 rotate-12 group-hover:rotate-0 transition-transform" />
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10 inline-block">Security Directive 892</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed italic uppercase tracking-widest opacity-80">Manual UPI assets must be cross-verified against real-time operational signatures. Quotations exceeding ₹10,000 threshold requirement secondary Faculty Council authentication.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Strategic Quotation Overlay */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-3xl" onClick={() => setIsQuoteModalOpen(false)} />
          <div className="relative max-w-2xl w-full p-12 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-10 animate-in zoom-in-95 duration-500 glass-elevated">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                     <Plus size={18} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Asset Acquisition Initiation</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter font-display text-white italic uppercase">Draft Quotation</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm">Dispatching formal procurement request into the institutional approval stream.</p>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="p-4 rounded-3xl bg-white/ text-slate-500 hover:text-white hover:bg-rose-500 transition-all group">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleAddQuotation} className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 ml-8 italic">Operational Intent Nomenclature</label>
                  <input required value={newQuote.title} onChange={e => setNewQuote({...newQuote, title: e.target.value})} placeholder="E.G. TITAN MISSION LOGISTICS" className="w-full bg-white/ border border-white/5 px-8 py-5 rounded-[2rem] outline-none focus:border-blue-500/50 text-white font-black uppercase tracking-tighter text-lg shadow-inner" />
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 ml-8 italic">Vendor Identity Node</label>
                    <input required value={newQuote.vendor} onChange={e => setNewQuote({...newQuote, vendor: e.target.value})} placeholder="NODE-XX" className="w-full bg-white/ border border-white/5 px-8 py-5 rounded-[2rem] outline-none focus:border-blue-500/50 text-white font-black uppercase tracking-widest text-sm shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 ml-8 italic">Fiscal Sum (₹)</label>
                    <input required type="number" value={newQuote.amount} onChange={e => setNewQuote({...newQuote, amount: Number(e.target.value)})} placeholder="0.00" className="w-full bg-white/ border border-white/5 px-8 py-5 rounded-[2rem] outline-none focus:border-blue-500/50 text-white font-black text-xl shadow-inner" />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 ml-8 italic">Operational Narrative & Justification</label>
                  <textarea required value={newQuote.desc} onChange={e => setNewQuote({...newQuote, desc: e.target.value})} rows={3} placeholder="Strategic justification for credit allocation..." className="w-full bg-white/ border border-white/5 px-8 py-6 rounded-[2.5rem] outline-none focus:border-blue-500/50 text-white font-medium text-sm leading-relaxed shadow-inner" />
               </div>
               <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  Initialize Approval Pipeline Module
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubFinance;
